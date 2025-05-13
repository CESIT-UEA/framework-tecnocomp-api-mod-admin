const {
  Usuario,
  Topico,
  VideoUrls,
  SaibaMais,
  Referencias,
  Exercicios,
  Alternativas,
} = require("../models");
const { sequelize } = require('../db/connect');
const videoUrlsService = require("./videoUrlsService");
const saibaMaisService = require("./saibaMaisService");
const referenciasService = require("./referenciasService");
const exerciciosService = require("./exerciciosService");
const { validarTopico } = require("../utils/validarTopico");
const bcrypt = require("bcrypt");
 
async function obterTopicoCompletoPorModulo(idModulo) {
  try {
    return await Topico.findAll({
      where: { id_modulo: idModulo },
      include: [
        { model: VideoUrls, as: "VideoUrls" },
        { model: SaibaMais, as: "SaibaMais" },
        { model: Referencias, as: "Referencias" },
        {
          model: Exercicios,
          as: "Exercicios",
          include: [{ model: Alternativas, as: "Alternativas" }],
        },
      ],
    });
  } catch (error) {
    console.error("Erro ao obter tópicos completos:", error);
    throw error;
  }
}
 
async function criarTopico(dadosTopico) {
  const erros = validarTopico(dadosTopico); 
  if (erros.length > 0) {
    throw new Error(`Validação falhou: ${erros.join("; ")}`);
  }

  try {
    const {
      nome_topico,
      id_modulo,
      ebookUrlGeral,
      textoApoio,
      videoUrls,
      saibaMais,
      referencias,
      exercicios,
    } = dadosTopico;

    const novoTopico = await Topico.create({
      nome_topico,
      id_modulo,
      ebookUrlGeral,
      textoApoio,
    });

    if (videoUrls)
      await videoUrlsService.criarVideoUrls(novoTopico.id, videoUrls);
    if (saibaMais)
      await saibaMaisService.criarSaibaMais(novoTopico.id, saibaMais);
    if (referencias)
      await referenciasService.criarReferencias(novoTopico.id, referencias);
    if (exercicios)
      await exerciciosService.criarExercicios(novoTopico.id, exercicios);

    return novoTopico;
  } catch (error) {
    console.error("Erro ao criar Tópico:", error);
    throw new Error("Erro ao criar Tópico");
  }
}

async function excluirTopico(id, idAdm, senhaAdm) {
  const transaction = await sequelize.transaction(); // Inicia a transação
  try {
    const admin = await Usuario.findOne({ where: { id: idAdm, tipo: "adm" } });
    if (!admin || !(await bcrypt.compare(senhaAdm, admin.senha))) {
      throw new Error("Autenticação falhou");
    }

    const topico = await Topico.findByPk(id, {
      include: [
        { model: VideoUrls, as: "VideoUrls" },
        { model: SaibaMais, as: "SaibaMais" },
        { model: Referencias, as: "Referencias" },
        {
          model: Exercicios,
          as: "Exercicios",
          include: [{ model: Alternativas, as: "Alternativas" }],
        },
      ],
      transaction, // Adiciona a transação
    });

    if (!topico) {
      throw new Error("Tópico não encontrado");
    }

    // Exclui VideoUrls
    topico.VideoUrls.forEach(async (video) => {
      await video.destroy({ transaction });
    });

    // Exclui SaibaMais
    topico.SaibaMais.forEach(async (saibaMais) => {
      await saibaMais.destroy({ transaction });
    });

    // Exclui Referencias
    topico.Referencias.forEach(async (referencia) => {
      await referencia.destroy({ transaction });
    });

    // Exclui Exercícios e Alternativas
    topico.Exercicios.forEach(async (exercicio) => {
      exercicio.Alternativas.forEach(async (alternativa) => {
        await alternativa.destroy({ transaction });
      });
      await exercicio.destroy({ transaction });
    });

    // Exclui o tópico
    await topico.destroy({ transaction });

    await transaction.commit(); // Confirma a transação
    return true;
  } catch (error) {
    await transaction.rollback(); // Reverte a transação em caso de erro
    console.error("Erro ao excluir tópico:", error);
    throw error;
  }
}



async function editarTopico(id, dadosAtualizados) {
  const {
    nome_topico,
    ebookUrlGeral,
    textoApoio,
    videoUrls,
    saibaMais,
    referencias,
    exercicios,
  } = dadosAtualizados;

  try {
    // Obter o tópico pelo ID e incluir os relacionamentos usando aliases
    const topico = await Topico.findByPk(id, {
      include: [
        { model: VideoUrls, as: 'VideoUrls' },
        { model: SaibaMais, as: 'SaibaMais' },
        { model: Referencias, as: 'Referencias' },
        { model: Exercicios, as: 'Exercicios', include: [{ model: Alternativas, as: 'Alternativas' }] },
      ],
    });

    if (!topico) {
      throw new Error("Tópico não encontrado");
    }

    // Atualizar os campos básicos do tópico
    await topico.update({ nome_topico, ebookUrlGeral, textoApoio });

    // Atualizar ou substituir VideoUrls
    if (videoUrls) {
      await VideoUrls.destroy({ where: { id_topico: id } });
      for (const url of videoUrls) {
        await VideoUrls.create({ id_topico: id, url });
      }
    }

    // Atualizar ou substituir SaibaMais
    if (saibaMais) {
      await SaibaMais.destroy({ where: { id_topico: id } });
      for (const item of saibaMais) {
        await SaibaMais.create({
          id_topico: id,
          descricao: item.descricao,
          url: item.url,
        });
      }
    }

    // Atualizar ou substituir Referencias
    if (referencias) {
      await Referencias.destroy({ where: { id_topico: id } });
      for (const ref of referencias) {
        await Referencias.create({
          id_topico: id,
          caminhoDaImagem: ref.caminhoDaImagem,
          referencia: ref.referencia,
        });
      }
    }

    // Atualizar ou substituir Exercicios e suas Alternativas
    if (exercicios) {
      await Exercicios.destroy({ where: { id_topico: id } });
      for (const exercicio of exercicios) {
        const novoExercicio = await Exercicios.create({
          id_topico: id,
          questao: exercicio.questao,
        });

        for (const alternativa of exercicio.alternativas) {
          await Alternativas.create({
            id_exercicio: novoExercicio.id,
            descricao: alternativa.descricao,
            explicacao: alternativa.explicacao,
            correta: alternativa.correta,
          });
        }
      }
    }

    // Retornar o tópico atualizado com o ID do módulo para o redirecionamento
    return {
      id_modulo: topico.id_modulo,
      nome_topico: topico.nome_topico,
    };
  } catch (error) {
    console.error("Erro ao editar tópico:", error);
    throw error;
  }
}



async function obterTopicoPorId(id) {
  try {
    const topico = await Topico.findByPk(id, {
      include: [
        { model: VideoUrls, as: 'VideoUrls' },
        { model: SaibaMais, as: 'SaibaMais' },
        { model: Referencias, as: 'Referencias' },
        {
          model: Exercicios,
          as: 'Exercicios',
          include: [{ model: Alternativas, as: 'Alternativas' }],
        },
      ],
    });
    console.log(JSON.stringify(topico, null, 2)); // Para verificar a saída no console
    if (!topico) {
      throw new Error('Tópico não encontrado');
    }

    return topico;
  } catch (error) {
    console.error('Erro ao obter tópico:', error);
    throw error;
  }
}


module.exports = {
  obterTopicoCompletoPorModulo,
  criarTopico,
  editarTopico,
  excluirTopico,
  obterTopicoPorId,
};

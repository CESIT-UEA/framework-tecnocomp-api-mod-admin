const { Modulo, Topico, VideoUrls, SaibaMais, Referencias, Exercicios, Alternativas, Usuario } = require('../models');

const bcrypt = require("bcrypt");
const topicoService = require("../services/topico");
const { randomUUID } = require("crypto");

async function criarModulo({ nome_modulo, video_inicial, ebookUrlGeral, nome_url, usuario_id }) {
  try {
    const uuid = randomUUID();  

    const modulo = await Modulo.create({
      nome_url,
      nome_modulo,
      ebookUrlGeral,
      video_inicial,
      usuario_id,
      uuid
    });

    return modulo;
  } catch (error) {
    console.error("Erro ao criar módulo:", error);
    throw new Error("Erro ao criar o módulo");
  }
}

async function listarModulos() {
  try {
    const modulos = await Modulo.findAll();
    return modulos;
  } catch (error) {
    console.error("Erro ao listar módulos:", error);
    throw new Error("Erro ao listar módulos");
  }
}

async function obterModulosPorUsuario(usuarioId) {
  try {
    const modulos = await Modulo.findAll({
      where: { usuario_id: usuarioId },
    });

    return modulos;
  } catch (error) {
    console.error("Erro ao obter módulos por usuário:", error);
    throw new Error("Erro ao obter módulos por usuário.");
  }
}


async function obterModuloPorId(id) {
  try {
    const modulo = await Modulo.findByPk(id);
    return modulo;
  } catch (error) {
    console.error("Erro ao buscar módulo por ID:", error);
    throw new Error("Erro ao buscar módulo por ID");
  }
}

async function atualizarModulo(id, dadosAtualizados) {
  try {
    const modulo = await Modulo.findByPk(id);
    if (!modulo) {
      return null; 
    }

    await modulo.update(dadosAtualizados);
    return modulo;
  } catch (error) {
    console.error("Erro ao atualizar módulo:", error);
    throw new Error("Erro ao atualizar módulo");
  }
}

async function deletarModulo(idAdm, senhaAdm, idExcluir) { 
  try {
    const admin = await Usuario.findOne({ where: { id: idAdm, tipo: "adm" } });
    if (!admin || !(await bcrypt.compare(senhaAdm, admin.senha))) {
      return false;
    }

    const modulo = await Modulo.findByPk(idExcluir, {
      include: [{ model: Topico, as: 'Topicos' }],
    });

    if (!modulo) {
      return false; // Módulo não encontrado
    }

    // Exclui o módulo e os tópicos relacionados em cascata
    await modulo.destroy();
    return true;
  } catch (error) {
    console.error("Erro ao deletar módulo:", error);
    throw new Error("Erro ao deletar módulo");
  }
}

async function atualizarStatusPublicacao(id, publicar) {
  try {
    const modulo = await Modulo.findByPk(id);

    if (!modulo) {
      return null; // Retorna null se o módulo não for encontrado
    }

    modulo.publicado = publicar; // Atualiza o status
    await modulo.save();

    return modulo; // Retorna o módulo atualizado
  } catch (error) {
    console.error('Erro ao atualizar status de publicação:', error);
    throw new Error('Erro ao atualizar status de publicação');
  }
}

async function obterModuloPorIdESeusTopicos(id) {
  try {
    const modulo = await Modulo.findByPk(id, {
      include: [
        {
          model: Topico,
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
        },
      ],
    });

    return modulo;
  } catch (error) {
    console.error("Erro ao buscar módulo por ID:", error);
    throw new Error("Erro ao buscar módulo por ID");
  }
}


module.exports = {
  criarModulo,
  listarModulos,
  obterModuloPorId,
  atualizarModulo,
  deletarModulo,
  atualizarStatusPublicacao,
  obterModuloPorIdESeusTopicos,
  obterModulosPorUsuario
};
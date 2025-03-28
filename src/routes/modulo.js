const express = require("express");
const {
  Modulo,
  Topico,
  VideoUrls,
  SaibaMais,
  Referencias,
  Exercicios,
  Alternativas,
} = require("../models");
const router = express.Router();

// Função utilitária para validar se uma string é nula ou vazia
function isNullOrEmpty(value) {
  return value == null || value.trim() === "";
}

// Validação dos videoUrls
function validarVideoUrls(topico, erros) {
  topico.videoUrls.forEach((videoUrl) => {
    console.log(videoUrl);
    if (isNullOrEmpty(videoUrl)) {
      erros.push(
        `Erro no videoUrls do tópico ${
          topico.titulo || "sem título"
        }: URL ausente`
      );
    }
  });
}

// Validação do saibaMais
function validarSaibaMais(topico, erros) {
  topico.saibaMais.forEach((saibaMais) => {
    if (isNullOrEmpty(saibaMais.url)) {
      erros.push(
        `Erro no Saiba mais do tópico ${
          topico.titulo || "sem título"
        }: URL ausente`
      );
    }
    if (isNullOrEmpty(saibaMais.descricao)) {
      erros.push(
        `Erro no Saiba mais do tópico ${
          topico.titulo || "sem título"
        }: Descrição ausente`
      );
    }
  });
}

// Validação das referencias
function validarReferencias(topico, erros) {
  topico.referencias.forEach((referencia) => {
    if (isNullOrEmpty(referencia.caminhoDaImagem)) {
      erros.push(
        `Erro nas referências do tópico ${
          topico.titulo || "sem título"
        }: Caminho da imagem ausente`
      );
    }
    if (isNullOrEmpty(referencia.referencia)) {
      erros.push(
        `Erro nas referências do tópico ${
          topico.titulo || "sem título"
        }: Referência ausente`
      );
    }
  });
}

// Validação dos exercícios e alternativas
function validarExercicios(topico, erros) {
  topico.exercicios.forEach((exercicio) => {
    if (isNullOrEmpty(exercicio.questao)) {
      erros.push(
        `Erro no exercício do tópico ${
          topico.titulo || "sem título"
        }: Questão ausente`
      );
    }

    exercicio.alternativas.forEach((alternativa) => {
      if (isNullOrEmpty(alternativa.descricao)) {
        erros.push(
          `Erro nas alternativas do exercício do tópico ${
            topico.titulo || "sem título"
          }: Descrição ausente`
        );
      }
      if (isNullOrEmpty(alternativa.explicacao)) {
        erros.push(
          `Erro nas alternativas do exercício do tópico ${
            topico.titulo || "sem título"
          }: Explicação ausente`
        );
      }
      if (alternativa.correta == null) {
        erros.push(
          `Erro nas alternativas do exercício do tópico ${
            topico.titulo || "sem título"
          }: Correção ausente`
        );
      }
    });
  });
}

// Validação geral dos tópicos
function validarTopicos(topicos, erros) {
  topicos.forEach((topico) => {
    validarVideoUrls(topico, erros);
    validarSaibaMais(topico, erros);
    validarReferencias(topico, erros);
    validarExercicios(topico, erros);
  });
}

router.post("/modulo",authMiddleware, async (req, res) => {
  try {
    const {
      nome_modulo,
      video_inicial,
      topicos,
      ebookUrlGeral,
      nome_url,
    } = req.body;
    const usuario_id = req.body.usuario_id;
    console.log(req.body);
    console.log("Início das verificações dos tópicos");

    let erros = [];

    if (topicos && Array.isArray(topicos)) {
      validarTopicos(topicos, erros);

      // Se houver erros, retornar todos de uma vez
      if (erros.length > 0) {
        return res.status(400).json({ erros });
      }
    } else {
      return res
        .status(400)
        .json({
          error: "Nenhum tópico foi enviado ou o formato está incorreto",
        });
    }

    // Criação do módulo
    const modulo = await Modulo.create({
      nome_url,
      nome_modulo,
      ebookUrlGeral,
      video_inicial,
      usuario_id,
    });

    // Criação de tópicos e seus relacionamentos
    for (const topico of topicos) {
      const novoTopico = await Topico.create({
        ...topico,
        id_modulo: modulo.id,
      });

      // Cadastro das VideoUrls associadas ao tópico
      for (const url of topico.videoUrls) {
        await VideoUrls.create({ id_topico: novoTopico.id, url });
      }

      // Cadastro das SaibaMais associadas ao tópico
      for (const sm of topico.saibaMais) {
        await SaibaMais.create({
          id_topico: novoTopico.id,
          descricao: sm.descricao,
          url: sm.url,
        });
      }

      // Cadastro das Referencias associadas ao tópico
      for (const ref of topico.referencias) {
        await Referencias.create({
          id_topico: novoTopico.id,
          caminhoDaImagem: ref.caminhoDaImagem,
          referencia: ref.referencia,
        });
      }

      // Cadastro dos Exercicios e suas alternativas
      for (const exercicio of topico.exercicios) {
        const novoExercicio = await Exercicios.create({
          id_topico: novoTopico.id,
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

    res.status(201).json({ modulo, topicos });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

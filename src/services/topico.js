const {
  Topico,
  VideoUrls,
  SaibaMais,
  Referencias,
  Exercicios,
  Alternativas,
} = require("../models");
const videoUrlsService = require("./videoUrlsService");
const saibaMaisService = require("./saibaMaisService");
const referenciasService = require("./referenciasService");
const exerciciosService = require("./exerciciosService");
const { validarTopico } = require("../utils/validarTopico");

async function obterTopicoCompletoPorModulo(idModulo) {
  try {
    return await Topico.findAll({
      where: { id_modulo: idModulo },
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
  } catch (error) {
    console.error('Erro ao obter tópicos completos:', error);
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

module.exports = {
  obterTopicoCompletoPorModulo,
  criarTopico,
};

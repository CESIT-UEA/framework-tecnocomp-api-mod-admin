const { VideoUrls } = require('../models');

async function criarVideoUrls(idTopico, urls) {
  try {
    const registros = urls.map((url) => ({ id_topico: idTopico, url }));
    await VideoUrls.bulkCreate(registros);
  } catch (error) {
    console.error('Erro ao criar VideoUrls:', error);
    throw new Error('Erro ao criar URLs de vídeo');
  }
}

module.exports = { criarVideoUrls };

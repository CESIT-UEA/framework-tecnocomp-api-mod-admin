const { Referencias } = require('../models');

async function criarReferencias(idTopico, referencias) {
  try {
    const registros = referencias.map((ref) => ({
      id_topico: idTopico,
      caminhoDaImagem: ref.caminhoDaImagem,
      referencia: ref.referencia,
    }));
    await Referencias.bulkCreate(registros);
  } catch (error) {
    console.error('Erro ao criar Referências:', error);
    throw new Error('Erro ao criar Referências');
  }
}

module.exports = { criarReferencias };

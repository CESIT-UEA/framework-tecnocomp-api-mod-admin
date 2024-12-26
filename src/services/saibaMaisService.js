const { SaibaMais } = require('../models');

async function criarSaibaMais(idTopico, saibaMais) {
  try {
    const registros = saibaMais.map((sm) => ({
      id_topico: idTopico,
      descricao: sm.descricao,
      url: sm.url,
    }));
    await SaibaMais.bulkCreate(registros);
  } catch (error) {
    console.error('Erro ao criar SaibaMais:', error);
    throw new Error('Erro ao criar SaibaMais');
  }
}

module.exports = { criarSaibaMais };

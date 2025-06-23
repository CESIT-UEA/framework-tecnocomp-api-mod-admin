const { FichaTecnica, Modulo } = require('../models');

async function criarFichaTecnica(modulo_id) {
  try {
    // Verifica se o módulo já possui ficha técnica
    const existente = await FichaTecnica.findOne({ where: { modulo_id } });
    if (existente) return existente;

    const ficha = await FichaTecnica.create({ modulo_id });
    return ficha;
  } catch (error) {
    console.error("Erro ao criar ficha técnica:", error);
    throw new Error("Erro ao criar ficha técnica");
  }
}

async function obterFichaPorModulo(modulo_id) {
  try {
    return await FichaTecnica.findOne({ where: { modulo_id } });
  } catch (error) {
    console.error("Erro ao buscar ficha técnica:", error);
    throw new Error("Erro ao buscar ficha técnica");
  }
}

async function deletarFichaTecnica(id) {
  try {
    const ficha = await FichaTecnica.findByPk(id);
    if (!ficha) return null;

    await ficha.destroy();
    return true;
  } catch (error) {
    console.error("Erro ao deletar ficha técnica:", error);
    throw new Error("Erro ao deletar ficha técnica");
  }
}

module.exports = {
  criarFichaTecnica,
  obterFichaPorModulo,
  deletarFichaTecnica,
};

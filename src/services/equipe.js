const { Equipe } = require('../models');

async function criarEquipe({ nome, ficha_tecnica_id }) {
  try {
    return await Equipe.create({ nome, ficha_tecnica_id });
  } catch (error) {
    console.error("Erro ao criar equipe:", error);
    throw new Error("Erro ao criar equipe");
  }
}

async function listarEquipes(ficha_tecnica_id) {
  try {
    return await Equipe.findAll({ where: { ficha_tecnica_id } });
  } catch (error) {
    console.error("Erro ao listar equipes:", error);
    throw new Error("Erro ao listar equipes");
  }
}

async function atualizarEquipe(id, novosDados) {
  try {
    const equipe = await Equipe.findByPk(id);
    if (!equipe) return null;

    await equipe.update(novosDados);
    return equipe;
  } catch (error) {
    console.error("Erro ao atualizar equipe:", error);
    throw new Error("Erro ao atualizar equipe");
  }
}

async function deletarEquipe(id) {
  try {
    const equipe = await Equipe.findByPk(id);
    if (!equipe) return null;

    await equipe.destroy();
    return true;
  } catch (error) {
    console.error("Erro ao deletar equipe:", error);
    throw new Error("Erro ao deletar equipe");
  }
}

module.exports = {
  criarEquipe,
  listarEquipes,
  atualizarEquipe,
  deletarEquipe,
};

const { Membro } = require('../models');

async function criarMembro({ nome, cargo, foto_url, equipe_id }) {
  try {
    return await Membro.create({ nome, cargo, foto_url, equipe_id });
  } catch (error) {
    console.error("Erro ao criar membro:", error);
    throw new Error("Erro ao criar membro");
  }
}

async function listarMembros(equipe_id) {
  try {
    return await Membro.findAll({ where: { equipe_id } });
  } catch (error) {
    console.error("Erro ao listar membros:", error);
    throw new Error("Erro ao listar membros");
  }
}

async function atualizarMembro(id, novosDados) {
  try {
    const membro = await Membro.findByPk(id);
    if (!membro) return null;

    await membro.update(novosDados);
    return membro;
  } catch (error) {
    console.error("Erro ao atualizar membro:", error);
    throw new Error("Erro ao atualizar membro");
  }
}

async function deletarMembro(id) {
  try {
    const membro = await Membro.findByPk(id);
    if (!membro) return null;

    await membro.destroy();
    return true;
  } catch (error) {
    console.error("Erro ao deletar membro:", error);
    throw new Error("Erro ao deletar membro");
  }
}

module.exports = {
  criarMembro,
  listarMembros,
  atualizarMembro,
  deletarMembro,
};

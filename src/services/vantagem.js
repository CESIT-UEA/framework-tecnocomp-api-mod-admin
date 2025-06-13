const { Vantagem } = require('../models');

async function listarVantagens(modulo_id) {
  return await Vantagem.findAll({ where: { modulo_id } });
}

async function criarVantagem(data) {
  return await Vantagem.create(data);
}

async function atualizarVantagem(id, dadosAtualizados) {
  const vantagem = await Vantagem.findByPk(id);
  if (!vantagem) return null;
  await vantagem.update(dadosAtualizados);
  return vantagem;
}

async function deletarVantagem(id) {
  const vantagem = await Vantagem.findByPk(id);
  if (!vantagem) return null;
  await vantagem.destroy();
  return true;
}

module.exports = {
  listarVantagens,
  criarVantagem,
  atualizarVantagem,
  deletarVantagem,
};

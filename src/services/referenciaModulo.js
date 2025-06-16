const ReferenciaModulo = require('../models/ReferenciaModulo');

async function criarReferencia(dados) {
  return await ReferenciaModulo.create(dados);
}

async function listarReferenciasPorModulo(moduloId) {
  return await ReferenciaModulo.findAll({ where: { modulo_id: moduloId } });
}

async function atualizarReferencia(id, novosDados) {
  const referencia = await ReferenciaModulo.findByPk(id);
  if (!referencia) return null;

  await referencia.update(novosDados);
  return referencia;
}

async function deletarReferencia(id) {
  const referencia = await ReferenciaModulo.findByPk(id);
  if (!referencia) return null;

  await referencia.destroy();
  return true;
}

module.exports = {
  criarReferencia,
  listarReferenciasPorModulo,
  atualizarReferencia,
  deletarReferencia,
};

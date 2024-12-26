const { Modulo, Usuario, Topico} = require("../models");
const bcrypt = require("bcrypt");

async function criarModulo({ nome_modulo, video_inicial, plataforma_id, ebookUrlGeral, nome_url, usuario_id }) {
  try {

    const modulo = await Modulo.create({
      nome_url,
      nome_modulo,
      ebookUrlGeral,
      video_inicial,
      plataforma_id,
      usuario_id,
    });

    return modulo;
  } catch (error) {
    console.error("Erro ao criar módulo:", error);
    throw new Error("Erro ao criar o módulo");
  }
}

async function listarModulos() {
  try {
    const modulos = await Modulo.findAll();
    return modulos;
  } catch (error) {
    console.error("Erro ao listar módulos:", error);
    throw new Error("Erro ao listar módulos");
  }
}

async function obterModuloPorId(id) {
  try {
    const modulo = await Modulo.findByPk(id);
    return modulo;
  } catch (error) {
    console.error("Erro ao buscar módulo por ID:", error);
    throw new Error("Erro ao buscar módulo por ID");
  }
}

async function atualizarModulo(id, dadosAtualizados) {
  try {
    const modulo = await Modulo.findByPk(id);
    if (!modulo) {
      return null; // Caso o módulo não seja encontrado
    }

    await modulo.update(dadosAtualizados);
    return modulo;
  } catch (error) {
    console.error("Erro ao atualizar módulo:", error);
    throw new Error("Erro ao atualizar módulo");
  }
}

async function deletarModulo(idAdm, senhaAdm, idExcluir) { 
  try {
    const admin = await Usuario.findOne({ where: { id: idAdm, tipo: "adm" } });
    if (!admin || !(await bcrypt.compare(senhaAdm, admin.senha))) {
      return false;
    }
    const modulo = await obterModuloPorId(idExcluir);
    if (!modulo) {
      return false;
    }

    await modulo.destroy();
    return true;
  } catch (error) {
    console.error("Erro ao deletar módulo:", error);
    throw new Error("Erro ao deletar módulo");
  }
}

async function obterTopicosPorModulo(moduloId) {
  try {
    // Busca o módulo e seus tópicos relacionados
    const topicos = await Topico.findAll({
      where: { id_modulo: moduloId },
    });
    return topicos;
  } catch (error) {
    console.error("Erro ao buscar tópicos do módulo:", error);
    throw new Error("Erro ao buscar tópicos do módulo");
  }
}

module.exports = {
  criarModulo,
  listarModulos,
  obterModuloPorId,
  atualizarModulo,
  deletarModulo,
  obterTopicosPorModulo,
};
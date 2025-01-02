const { PlataformaRegistro, Usuario } = require("../models");
const bcrypt = require("bcrypt");

async function criarPlataforma({
  plataformaUrl,
  plataformaNome,
  idCliente,
  usuario_id,
}) {
  try {
    const novaPlataforma = await PlataformaRegistro.create({
      plataformaUrl,
      plataformaNome,
      idCliente,
      usuario_id: parseInt(usuario_id),
    });

    return novaPlataforma;
  } catch (error) {
    console.error("Erro ao criar plataforma:", error);
    throw new Error("Erro ao criar a plataforma");
  }
}

async function listarPlataformas() {
  try {
    const plataformas = await PlataformaRegistro.findAll();
    return plataformas;
  } catch (error) {
    console.error("Erro ao listar plataformas:", error);
    throw new Error("Erro ao listar plataformas");
  }
}

async function obterPlataformaPorId(id) {
  try {
    const plataforma = await PlataformaRegistro.findByPk(id);
    return plataforma;
  } catch (error) {
    console.error("Erro ao buscar plataforma por ID:", error);
    throw new Error("Erro ao buscar plataforma por ID");
  }
}

async function obterPlataformasPorUsuario(usuarioId) {
  try {
    const plataformas = await PlataformaRegistro.findAll({
      where: { usuario_id: usuarioId },
    });

    return plataformas;
  } catch (error) {
    console.error("Erro ao obter plataformas por usuário:", error);
    throw new Error("Erro ao obter plataformas por usuário.");
  }
}

async function atualizarPlataforma(id, dadosAtualizados) {
  try {
    const plataforma = await PlataformaRegistro.findByPk(id);
    if (!plataforma) {
      return null;
    }

    await plataforma.update(dadosAtualizados);
    return plataforma;
  } catch (error) {
    console.error("Erro ao atualizar plataforma:", error);
    throw new Error("Erro ao atualizar plataforma");
  }
}

async function deletarPlataforma(idAdm, senhaAdm, idExcluir) {
  try {
    const admin = await Usuario.findOne({ where: { id: idAdm, tipo: "adm" } });
    if (!admin || !(await bcrypt.compare(senhaAdm, admin.senha))) {
      return false;
    }

    const plataforma = await PlataformaRegistro.findByPk(idExcluir);
    if (!plataforma) {
      return false;
    }

    await plataforma.destroy();
    return true;
  } catch (error) {
    console.error("Erro ao deletar plataforma:", error);
    throw new Error("Erro ao deletar plataforma");
  }
}

module.exports = {
  criarPlataforma,
  listarPlataformas,
  obterPlataformaPorId,
  atualizarPlataforma,
  deletarPlataforma,
  obterPlataformasPorUsuario
};

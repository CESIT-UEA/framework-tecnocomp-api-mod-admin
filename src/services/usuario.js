const { Usuario } = require("../models");
const bcrypt = require("bcrypt");

async function getDadosUser() {
  try {
    return await Usuario.findAll({
      attributes: { exclude: ["senha"] },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar usuários");
  }
}

async function getDadosUserById(id) {
  try {
    return await Usuario.findOne({
      where: { id },
      attributes: { exclude: ["senha"] },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar usuário por ID");
  }
}

async function updateUser(idAdm, senhaAdm, username, email, tipo, idEditar) {
  try {
    const admin = await Usuario.findOne({ where: { id: idAdm, tipo: "adm" } });
    if (!admin || !(await bcrypt.compare(senhaAdm, admin.senha))) {
      return false;
    }

    const user = await Usuario.findOne({ where: { id: idEditar } });
    if (!user) {
      return false;
    }

    await user.update({ username, email, tipo });
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao atualizar usuário");
  }
}

async function deleteUser(idAdm, senhaAdm, idExcluir) {
  try {
    const admin = await Usuario.findOne({ where: { id: idAdm, tipo: "adm" } });
    if (!admin || !(await bcrypt.compare(senhaAdm, admin.senha))) {
      return false;
    }

    const user = await Usuario.findOne({ where: { id: idExcluir } });
    if (!user) {
      return false;
    }

    await user.destroy();
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao excluir usuário");
  }
}

module.exports = { getDadosUser, getDadosUserById, updateUser, deleteUser };

const { Usuario } = require("../models");
const bcrypt = require("bcrypt");

async function getDadosUser() {
  try {
    const users = await Usuario.findAll({
      attributes: { exclude: ["senha"] },
    });
    return users;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function getDadosUserById(id) {
  try {
    const user = await Usuario.findOne({
      where: { id },
      attributes: { exclude: ["senha"] },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function updateUser(idAdm, senhaAdm, username, email, tipo,idEditar ) {
  try {
    const admin = await Usuario.findOne({ where: { id: idAdm, tipo: 'adm' } });
    if (!admin) {
      return false
    }

    const senhaValida = await bcrypt.compare(senhaAdm, admin.senha);
    if (!senhaValida) {
      return false
    }

    const user = await Usuario.findOne({ where: { id: idEditar } });
    if (!user) {
      return false
    }
    await user.update({ username, email, tipo });
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
}
module.exports = { getDadosUser, getDadosUserById, updateUser };

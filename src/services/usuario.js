const { Usuario } = require("../models");

async function getDadosUser() {
  try {
    const users = await Usuario.findAll({
      attributes: { exclude: ['senha'] },
    });
    return users;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = { getDadosUser };

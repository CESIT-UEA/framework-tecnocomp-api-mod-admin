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

async function atualizarPerfil(id, { senhaAtual, novaSenha, username, email }) {
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return { sucesso: false, status: 404, mensagem: 'Usuário não encontrado.' };
    }

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) {
      return { sucesso: false, status: 401, mensagem: 'Senha atual incorreta.' };
    }

    // Atualiza os campos fornecidos
    if (username) usuario.username = username;
    if (email) usuario.email = email;
    if (novaSenha) usuario.senha = await bcrypt.hash(novaSenha, 10);

    await usuario.save();

    return { sucesso: true, status: 200, mensagem: 'Perfil atualizado com sucesso.' };
  } catch (error) {
    console.error('Erro ao atualizar perfil no serviço:', error);
    return { sucesso: false, status: 500, mensagem: 'Erro ao atualizar perfil.' };
  }
}

module.exports = { getDadosUser, getDadosUserById, updateUser, deleteUser,atualizarPerfil };

const { Usuario, Modulo, UsuarioTemporario } = require("../models");
const bcrypt = require("bcrypt");
const { gerarCodigoEmail } = require("../utils/validarEmail");

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


async function createUser(nome, email, senha, tipo, isUserTemporario){
    try{
      const hashedPassword = await bcrypt.hash(senha, 10);

      if (isUserTemporario){
        const codigoEmail = gerarCodigoEmail()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

        await UsuarioTemporario.create(
          { username: nome, email, senha: hashedPassword, verificationCode: codigoEmail, tipo, expiresAt}
        )
        return {isUserTemporario, codigoEmail}
      }

      /* verifica se existe um usuário temporario com o mesmo email e cria um usuário permanente com a senha
         criptografada do usuário temporário */
      const verificaUsuarioTemporario = await UsuarioTemporario.findOne({where: {email}})
      if (verificaUsuarioTemporario){
          const usuarioTemporario = verificaUsuarioTemporario.dataValues 
          await Usuario.create({ username: nome, email, senha: usuarioTemporario.senha, tipo});
          return
      }

      await Usuario.create({ username: nome, email, senha: hashedPassword, tipo});
      return true

    }catch(error){
      console.error(error);
      throw new Error("Erro ao criar usuário");
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
      return {
        sucesso: false,
        status: 404,
        mensagem: "Usuário não encontrado.",
      };
    }

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) {
      return {
        sucesso: false,
        status: 401,
        mensagem: "Senha atual incorreta.",
      };
    }

    if (username) usuario.username = username;
    if (email) usuario.email = email;
    if (novaSenha) usuario.senha = await bcrypt.hash(novaSenha, 10);

    await usuario.save();

    return {
      sucesso: true,
      status: 200,
      mensagem: "Perfil atualizado com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao atualizar perfil no serviço:", error);
    return {
      sucesso: false,
      status: 500,
      mensagem: "Erro ao atualizar perfil.",
    };
  }
}

async function verificaModuloEhDoUsuario(id_usuario, id_modulo) {
  const usuario = await Usuario.findByPk(id_usuario);
  if (!usuario) {
    return false;
  }

  const verificaModulo = await Modulo.findOne({
    where: { usuario_id: usuario.id, id: id_modulo },
  });

  if (verificaModulo != null) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  getDadosUser,
  getDadosUserById,
  createUser,
  updateUser,
  deleteUser,
  atualizarPerfil,
  verificaModuloEhDoUsuario,
};

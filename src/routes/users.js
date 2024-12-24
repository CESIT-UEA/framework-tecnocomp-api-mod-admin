const express = require("express");
const { Usuario } = require("../models");
const bcrypt = require("bcrypt");
const router = express.Router();
const userService = require("../services/usuario");

router.get("/listar-usuarios", async (req, res) => {
  try {
    let users = await userService.getDadosUser();
    res.status(200).json({ users: users });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userService.getDadosUserById(id);

    return res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { idAdm, senhaAdm, username, email, tipo } = req.body; // Informações do 
    const idEditar = req.params.id; // ID do usuário a ser atualizado

    const userUpdate = await userService.updateUser(
        idAdm, senhaAdm, username, email, tipo, idEditar
    );
    if (userUpdate == false) {
      return res.status(401).json({ message: "Usuario não autorizado" });
    }
    console.log(userUpdate)
    return res.status(200).json({ message: "Usuário atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.delete('/users', async (req, res) => {
    try {
      const { idAdm, senhaAdm, idExcluir } = req.body;
  
      const admin = await Usuario.findOne({ where: { id: idAdm, tipo: 'adm' } });
      if (!admin) {
        return res.status(403).json({ message: 'Permissão negada. Usuário não é um administrador.' });
      }
      const senhaValida = await bcrypt.compare(senhaAdm, admin.senha);
      if (!senhaValida) {
        return res.status(401).json({ message: 'Senha de administrador incorreta.' });
      }
  
      const user = await Usuario.findOne({ where: { id: idExcluir } });
      if (!user) {
        return res.status(404).json({ message: 'Usuário a ser excluído não encontrado.' });
      }
  
      await user.destroy();
      return res.status(200).json({ message: `Usuário com ID ${idExcluir} excluído com sucesso.` });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  });

module.exports = router;

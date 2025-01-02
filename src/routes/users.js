const express = require("express");
const router = express.Router();
const userService = require("../services/usuario");
const authMiddleware = require('../middleware/auth');

router.get("/listar-usuarios",authMiddleware, async (req, res) => {
  try {
    const users = await userService.getDadosUser();
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/users/:id",authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getDadosUserById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.put("/users/:id",authMiddleware, async (req, res) => {
  try {
    const { idAdm, senhaAdm, username, email, tipo } = req.body;
    const idEditar = req.params.id;
    const result = await userService.updateUser(idAdm, senhaAdm, username, email, tipo, idEditar);

    if (result === false) {
      return res.status(401).json({ message: "Usuário não autorizado" });
    }

    res.status(200).json({ message: "Usuário atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.delete("/users",authMiddleware, async (req, res) => {
  try {
    const { idAdm, senhaAdm, idExcluir } = req.body;
    const result = await userService.deleteUser(idAdm, senhaAdm, idExcluir);

    if (result === false) {
      return res.status(403).json({ message: "Permissão negada ou dados inválidos." });
    }

    res.status(200).json({ message: `Usuário com ID ${idExcluir} excluído com sucesso.` });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

router.patch('/users/:id/self', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { senhaAtual, novaSenha, username, email } = req.body;

    const resultado = await userService.atualizarPerfil(id, { senhaAtual, novaSenha, username, email });

    console.log(resultado)
    if (!resultado.sucesso) {
      return res.status(401).json({ error: "Senha incorreta ou Não Autorizado" });
    }

    res.json({ message: resultado.mensagem });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil.' });
  }
});


module.exports = router;

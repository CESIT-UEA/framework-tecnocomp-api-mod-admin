const express = require("express");
const templateService = require("../services/templates");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Listar templates
router.get("/templates", authMiddleware, async (req, res) => {
  try {
    const templates = await templateService.listarTemplates();
    res.status(200).json(templates);
  } catch (error) {
    console.error("Erro ao listar templates:", error);
    res.status(500).json({ error: "Erro ao listar templates" });
  }
});

// Visualizar detalhes de um template
router.get("/templates/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const template = await templateService.obterTemplatePorId(id);

    if (!template) {
      return res.status(404).json({ error: "Template não encontrado" });
    }

    res.status(200).json(template);
  } catch (error) {
    console.error("Erro ao buscar template:", error);
    res.status(500).json({ error: "Erro ao buscar template" });
  }
});

// Clonar template
router.post("/templates/clonar/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id; // Obtém o ID do usuário autenticado
    const novoModulo = await templateService.clonarTemplate(id, usuarioId);

    if (!novoModulo) {
      return res.status(404).json({ error: "Template não encontrado" });
    }

    res.status(201).json(novoModulo);
  } catch (error) {
    console.error("Erro ao clonar template:", error);
    res.status(500).json({ error: "Erro ao clonar template" });
  }
});

router.patch("/template/modulo/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { template } = req.body; // true ou false para definir o status

    if (template === undefined) {
      return res.status(400).json({ error: 'O campo "template" é obrigatório' });
    }

    const moduloAtualizado = await templateService.atualizarStatusTemplate(id, template);

    if (!moduloAtualizado) {
      return res.status(404).json({ error: "Módulo não encontrado" });
    }

    res.status(200).json(moduloAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar status de template:", error);
    res.status(500).json({ error: "Erro ao atualizar status de template" });
  }
});


module.exports = router;

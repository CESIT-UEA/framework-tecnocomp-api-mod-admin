const express = require("express");
const moduloService = require("../services/modulo");
const topicoService = require("../services/topico");
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.post("/modulo",authMiddleware, async (req, res) => {
  try {
    const { nome_modulo, video_inicial, plataforma_id, ebookUrlGeral, nome_url, usuario_id } = req.body;

    const modulo = await moduloService.criarModulo({
      nome_modulo,
      video_inicial,
      plataforma_id,
      ebookUrlGeral,
      nome_url,
      usuario_id,
    });

    res.status(201).json({ modulo });
  } catch (error) {
    console.error("Erro ao criar módulo:", error);
    res.status(400).json({ error: error.message });
  }
});

// Listar todos os módulos
router.get("/modulos",authMiddleware, async (req, res) => {
  try {
    const modulos = await moduloService.listarModulos();
    res.status(200).json(modulos);
  } catch (error) {
    console.error("Erro ao listar módulos:", error);
    res.status(500).json({ error: "Erro ao listar módulos" });
  }
});

router.put("/modulos/:id",authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;
    const moduloAtualizado = await moduloService.atualizarModulo(id, dadosAtualizados);
    if (!moduloAtualizado) {
      return res.status(404).json({ error: "Módulo não encontrado" });
    }
    res.status(200).json(moduloAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar módulo:", error);
    res.status(500).json({ error: "Erro ao atualizar módulo" });
  }
});

router.delete("/modulos/:id",authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { idAdm, senhaAdm } = req.query

    const deletado = await moduloService.deletarModulo(idAdm, senhaAdm, id);
    if (!deletado) {
      return res.status(404).json({ error: "Módulo não encontrado" });
    }
    res.status(200).json({ message: "Módulo deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar módulo:", error);
    res.status(500).json({ error: "Erro ao deletar módulo" });
  }
});

router.patch('/modulos/:id/publicar',authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { publicar } = req.body;

    if (publicar === undefined) {
      return res.status(400).json({ error: 'O campo "publicar" é obrigatório' });
    }

    const moduloAtualizado = await moduloService.atualizarStatusPublicacao(id, publicar);

    if (!moduloAtualizado) {
      return res.status(404).json({ error: 'Módulo não encontrado' });
    }

    res.status(200).json(moduloAtualizado);
  } catch (error) {
    console.error('Erro ao alterar status de publicação:', error);
    res.status(500).json({ error: 'Erro ao alterar status de publicação' });
  }
});

router.get("/modulo/:id",authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID recebido na rota:", id); // Log para verificar o ID recebido
    const modulo = await moduloService.obterModuloPorIdESeusTopicos(id);
    if (!modulo) {
      return res.status(404).json({ error: "Módulo não encontrado" });
    }
    console.log("Módulo encontrado:", modulo); // Log para verificar o retorno
    res.status(200).json(modulo);
  } catch (error) {
    console.error("Erro ao buscar módulo:", error);
    res.status(500).json({ error: "Erro ao buscar módulo" });
  }
});

module.exports = router;

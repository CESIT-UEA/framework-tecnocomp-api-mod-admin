const express = require('express');
const plataformaService = require('../services/plataformaService');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/plataforma', authMiddleware, async (req, res) => {
  try {
    const novaPlataforma = await plataformaService.criarPlataforma(req.body);
    res.status(201).json(novaPlataforma);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/plataforma', async (req, res) => {
  try {
    const plataformas = await plataformaService.listarPlataformas();
    res.json(plataformas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/plataforma/:id', async (req, res) => {
  try {
    const plataforma = await plataformaService.obterPlataformaPorId(req.params.id);
    if (!plataforma) {
      return res.status(404).json({ error: 'Plataforma não encontrada' });
    }
    res.json(plataforma);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/plataforma/:id', authMiddleware, async (req, res) => {
  try {
    const plataformaAtualizada = await plataformaService.atualizarPlataforma(req.params.id, req.body);
    if (!plataformaAtualizada) {
      return res.status(404).json({ error: 'Plataforma não encontrada' });
    }
    res.json(plataformaAtualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Deletar uma plataforma
router.delete('/plataforma/:id', authMiddleware, async (req, res) => {
  try { 
    const { id } = req.params
    const { idAdm, senhaAdm } = req.query 

    const sucesso = await plataformaService.deletarPlataforma(idAdm, senhaAdm, id);
    if (!sucesso) {
      return res.status(404).json({ error: 'Plataforma não encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const topicoService = require('../services/topico');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/topicos/:id',authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID do tópico é obrigatório' });
    }

    const topico = await topicoService.obterTopicoCompletoPorModulo(id);
    res.status(200).json(topico);
  } catch (error) {
    console.error('Erro ao buscar tópico completo:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/topicos',authMiddleware, async (req, res) => {
  try {
    const dadosTopico = req.body;

    if (!dadosTopico.id_modulo || !dadosTopico.nome_topico) {
      return res.status(400).json({ error: 'Campos obrigatórios estão ausentes' });
    }
    const novoTopico = await topicoService.criarTopico(dadosTopico);
    console.log(dadosTopico)
    res.status(201).json(novoTopico);
  } catch (error) {
    console.error('Erro ao criar tópico:', error);
    res.status(400).json({ error: error.message });
  }
});

// Editar tópico
router.put('/topico/:id',authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    const topico = await topicoService.editarTopico(id, dadosAtualizados);
    res.status(200).json(topico);
  } catch (error) {
    console.error('Erro ao editar tópico:', error);
    res.status(500).json({ error: error.message });
  }
});

// Excluir tópico
router.delete('/topico/:id',authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { idAdm, senhaAdm } = req.query;

    await topicoService.excluirTopico(id, idAdm, senhaAdm);
    console.log("Teste")
    res.status(200).json({ message: 'Tópico excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir tópico:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/topico/:id',authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const topico = await topicoService.obterTopicoPorId(id);
    res.status(200).json(topico);
  } catch (error) {
    console.error('Erro ao obter tópico:', error.message);
    res.status(404).json({ error: 'Tópico não encontrado' });
  }
});

module.exports = router;

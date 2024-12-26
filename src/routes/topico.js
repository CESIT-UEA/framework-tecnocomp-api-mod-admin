const express = require('express');
const topicoService = require('../services/topico');
const router = express.Router();

router.get('/topicos/:id', async (req, res) => {
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

module.exports = router;

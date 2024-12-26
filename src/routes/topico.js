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

router.post('/topicos', async (req, res) => {
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

module.exports = router;

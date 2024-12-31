const express = require('express');
const { PlataformaRegistro } = require('../models');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/plataforma', authMiddleware, async (req, res) => {
  const { plataformaUrl, plataformaNome, idCliente, usuario_id } = req.body;
  id_criador = parseInt(usuario_id)

  try {
    const novaPlataforma = await PlataformaRegistro.create({
      plataformaUrl: plataformaUrl,
      plataformaNome: plataformaNome,
      idCliente: idCliente,
      usuario_id: id_criador
    });

    res.status(201).json(novaPlataforma);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error });
  }
});

router.get('/plataforma',authMiddleware, async (req, res) => {
  try {
    const plataformas = await PlataformaRegistro.findAll();
    res.json(plataformas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

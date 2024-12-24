const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const router = express.Router();
const SECRET_KEY = 'your_secret_key'; // Use uma chave secreta segura

// Registro
router.post('/register', async (req, res) => {
  console.log(req.body)
  try {
    const { nome, email, senha, tipo } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({ username: nome, email: email, senha: hashedPassword, tipo: tipo });
    res.status(201).json(usuario);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo, username: usuario.username, email: usuario.email }, SECRET_KEY, { expiresIn: '1h' });
    const dados = jwt.decode(token);
    res.json({ token,dados });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

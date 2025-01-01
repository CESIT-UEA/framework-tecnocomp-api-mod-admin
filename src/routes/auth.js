const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const router = express.Router();
const SECRET_KEY = 'your_secret_key'; // Chave secreta do Access Token
const REFRESH_SECRET_KEY = 'your_refresh_secret_key'; // Chave secreta do Refresh Token

// Registro
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({ username: nome, email, senha: hashedPassword, tipo });
    res.status(201).json(usuario);
  } catch (error) {
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

    const accessToken = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo, username: usuario.username, email: usuario.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign({ id: usuario.id }, REFRESH_SECRET_KEY, { expiresIn: '7d' });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para renovar Access Token
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh Token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid Refresh Token' });
  }
});

module.exports = router;

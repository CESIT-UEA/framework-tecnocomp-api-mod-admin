const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const authorizeRole = require('../middleware/authorizeRole');
const authMiddleware = require('../middleware/auth');
const { createUser } = require('../services/usuario');
const router = express.Router();
const SECRET_KEY = 'your_secret_key';
const REFRESH_SECRET_KEY = 'your_refresh_secret_key';


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Administrador registra um novo usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *               - tipo
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               tipo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro ao registrar usuário
 */
router.post('/register',authMiddleware, authorizeRole(['adm']), async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;
    
    const tiposPermitidos = ['adm', 'professor'];
    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({ message: "Tipo de usuário inválido. Permitido: 'adm' ou 'professor'." });
    }

    const emailExistente = await Usuario.findOne({where: {email}});
    if (emailExistente) {
      return res.status(400).json({ message: "Este E-mail já está sendo utilizado." });
    }

    await createUser(nome, email, senha, tipo, false)

    res.status(201).json({ message: `Usuário criado com sucesso.` });
  }
  catch (error) {
    res.status(400).json({message: "Erro ao criar usuário"})
  }
});


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna tokens
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 *       404:
 *         description: Usuário não encontrado
 */
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


/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Gera um novo Access Token a partir do Refresh Token
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Novo token gerado com sucesso
 *       401:
 *         description: Refresh token inválido
 *       403:
 *         description: Token não fornecido
 */
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

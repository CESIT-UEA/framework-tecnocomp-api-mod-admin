const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { validarCadastroUser } = require('../utils/validarUsuario');
const { enviarCodigoEmail } = require('../utils/validarEmail');
const crypto = require('crypto');
const { where } = require('sequelize');
const { enviarEmail } = require('../services/email')
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

    const sucesso = await createUser(nome, email, senha, tipo)
    if (!sucesso){
      return res.status(400).json({ message: "E-mail já está em uso." });
    }

    res.status(201).json({ message: `Usuário criado com sucesso.` });
  }
  catch (error) {
    res.status(400).json({message: "Erro ao criar usuário"})
  }
});


router.post('/auto-register', async (req, res)=>{
  try{
    const { nome, email, senha } = req.body;
    
    const sucesso = await createUser(nome, email, senha, 'professor')
    if (!sucesso){
        return res.status(400).json({ message: "E-mail já está em uso." });
    }
    
    res.status(201).json({ message: `Usuário criado com sucesso.` });
  } catch{
    res.status(400).json({message: "Erro ao criar usuário"})
  }
})


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



router.post('/forgot_password', async (req, res) => {
    const { email, baseUrl } = req.body;
    try{
      // verifica se o email está cadastrado no banco.
      const usuario = await Usuario.findOne({ where: { email } });
      
      if (!usuario) {
        return res.status(404).json({ message: 'User not found' });
      }

      // gera um token que expira depois de 1 hora.
      const token = crypto.randomBytes(20).toString('hex')
      const now = new Date()
      now.setHours(now.getHours() + 1)

      // atualiza no banco o token e o tempo de expiração.
      await usuario.update(
        { password_reset_token: token, password_reset_expires: now }
      )
      
      // link enviado para o email do usuário que redireciona para página de redefinir senha 
      const link = `${baseUrl}/reset-password?email=${email}&token=${token}`;
      enviarEmail(
        email, 
        titulo = "Redefinir Senha", 
        texto = null,
        html = `
        <h2>Redefinição de Senha</h2>
        <p>Você solicitou uma redefinição de senha. Clique no link abaixo para continuar:</p>
        <a href="${link}">Redefinir senha</a>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
        `
      )
      
      res.json({message: "sucess"})

    }catch(error) {
      console.error('Erro no forgot_password:', error);
      res.status(400).json({ error: 'Erro on forgot password, try again'})
    }
})


router.post('/reset_password', async (req, res)=>{
    const { email, token, novaSenha } = req.body
    try {
      // verificação se algum parâmetro esta vazio
      if (!email || !token || !novaSenha){
          return res.status(400).json({ error: 'Cannot reset password, try again'});
      }

      // consultando o usuario no banco pelo email
      const usuario = await Usuario.findOne(
        { where: { email }}
      );
      
      if (!usuario) {
        return res.status(404).json({ message: 'User not found' });
      }

      // verifica se o token foi manipulado na rota
      if (usuario.dataValues.password_reset_token !== token){
        return res.status(404).json({ error: 'Token invalid!' });
      }

      // verifica se o token expirou
      const now = new Date()
      if (now > usuario.dataValues.password_reset_expires){
        return res.status(400).json({ error: 'Token expired, generate a new one'});
      }

      // redefine a senha e torna o token expirado
      usuario.senha = await bcrypt.hash(novaSenha, 10);
      usuario.password_reset_token = null;
      usuario.password_reset_expires = null;

      await usuario.save();

      res.json({message: "sucess"})
    } catch (error) {
      console.error(error);
      res.status(400).json({error: 'Cannot reset password, try again'})
    }

})


router.post('/valida_link', async(req, res)=>{
    const { email, token, baseUrl } = req.body
    try{
        // verifica se os parâmetros estão vazio
        if (!email || !token || !baseUrl) {
            return res.json({ redirect: `/login`, error: 'Missing required parameters' });
        }

        // verifica se o email e o token da rota estão salvos no banco 
        const usuario = await Usuario.findOne({where: {email: email, password_reset_token:token}})
        if (!usuario){
            // pode ser redirecionado para a página de cadastro de conta quando for implementado esta tela 
             return res.json({ redirect: `/login`, error: 'Invalid link' });
        }
       
        // verifica se o token expirou
        const now = new Date()
        if (now > usuario.dataValues.password_reset_expires) {
            return res.json({ redirect: `/login`, error: 'Token expired' });
}
        return res.json({ redirect: `/reset-password?email=${email}&token=${token}` });
    }catch(error){
        console.log(error)
        res.status(400).json({error})
    }
})


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

const express = require('express');
const { Usuario } = require('../models');
const crypto = require('crypto');
const { enviarEmail } = require('../services/email')
const router = express.Router();

router.post('/forgot_password', async (req, res) => {
    const { email, baseUrl } = req.body;
    try{
      // verifica se o email está cadastrado no banco.
      const usuario = await Usuario.findOne({ where: { email } });
      
      if (!usuario) {
        return res.status(404).json({ message: 'User not found', sucess: false });
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
      
      res.json({message: "Email enviado com sucesso", sucess: true})

    }catch(error) {
      console.error('Erro no forgot_password:', error);
      res.status(400).json({ error: 'Erro on forgot password, try again', sucess: false})
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

module.exports = router;
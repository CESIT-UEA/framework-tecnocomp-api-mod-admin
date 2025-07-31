const express = require('express');
const { enviarCodigoEmail } = require('../utils/validarEmail');
const { createUser } = require('../services/usuario');
const { Usuario, UsuarioTemporario } = require('../models');
const router = express.Router();

router.post('/autoRegister', async (req, res)=>{
  try{
    const { nome, email, senha } = req.body;

    const emailExistente = await Usuario.findOne({where: { email }});
    if (emailExistente) {
      return res.status(400).json({ message: "Este E-mail já está sendo utilizado.", sucess: false });
    }

    await UsuarioTemporario.destroy({where: {email}})

    const {isUserTemporario, codigoEmail} = await createUser(nome, email, senha, 'professor', true)
    
    if (isUserTemporario){
        enviarCodigoEmail(email, codigoEmail)
    }
    
    res.status(200).json({ message: `Código de verificação enviado por E-mail!`, sucess: true });
  } catch{
    res.status(400).json({message: "Erro ao enviar código para email"})
  }
})


router.post('/valida_autoRegister', async (req, res)=>{
  try {
    const {email, codigo} = req.body
    const temporario = await UsuarioTemporario.findOne({where: {email}})
    
    if (!temporario){
      return res.status(400).json({ message: 'Nenhum cadastro pendente encontrado' });
    }

    const usuario = temporario.dataValues

    if (usuario.verificationCode !== codigo){
      return res.status(400).json({ message: 'Código inválido' });
    }

    if (usuario.expiresAt < new Date()){
      return res.status(400).json({ message: 'Código expirado' });
    }

    await createUser(usuario.username, usuario.email, usuario.senha, usuario.tipo, false)
    await UsuarioTemporario.destroy({where: {email}})

    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno' });
  }

})

module.exports = router;
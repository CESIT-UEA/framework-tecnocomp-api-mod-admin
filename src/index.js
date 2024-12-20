require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const { sequelize } = require('./db/connect');
const { Usuario } = require('./models');
const authRoutes = require('./routes/auth');
const plataformaRoutes = require('./routes/plataforma');
const moduloRoutes = require('./routes/modulo');

const app = express();
const PORT = 8001;
const SECRET_KEY = 'your_secret_key'; // Use uma chave secreta segura

let sslOptions;

if (process.env.PRODUCAO_VARIAVEL == 'true') {
  sslOptions = {
    key: fs.readFileSync("/certs/uea.edu.br.key"),
    cert: fs.readFileSync("/certs/uea.edu.br.fullchain.crt"),
  };
}

app.use(express.json());
app.use(cors());

// Rotas
app.use('/auth', authRoutes);
app.use('/api', plataformaRoutes);
app.use('/api', moduloRoutes);

// Inicializa o servidor e cria um administrador padrão se não existir
const setup = async () => {
  await sequelize.sync();

  const adminExists = await Usuario.findOne({ where: { tipo: 'adm' } });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10); // Senha padrão, mude para algo seguro
    await Usuario.create({
      username: 'Administrador',
      email: 'admin@admin.com',
      senha: hashedPassword,
      tipo: 'adm'
    });
    console.log('Administrador padrão criado com sucesso.');
  }
  if(process.env.PRODUCAO_VARIAVEL == 'true'){
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`Servidor rodando em https://172.25.1.5:${PORT}`);
    });
  }else{
    app.listen(3001, () => {
      //Comentario
      console.log(`Example app listening on port 4001`)
    })
  }

};

setup();

module.exports = app;

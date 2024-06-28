const express = require('express');
const cors = require('cors');
const Plataforma = require('./models/registro_plataforma.js')
const { Sequelize } = require('sequelize');
const { sequelize } = require('./db/connect.js');


const app = express();
const PORT = 3100;

app.use(cors({
    origin: ['http://localhost:49691'],
    credentials: true
}))

app.use(express.json())



app.get('/plataforma', async (req, res)=>{
    // const Plataforma = require('../src/models/registro_plataforma.js');
    // await Plataforma.sync({force: true})
    // const plataforma = await Plataforma.findAll({attributes: ['nomeCliente']})
    // res.status(200).json(plataforma[0].nomeCliente)
})

app.post('/cadastro_lms', async (req, res)=>{
    const dados = req.body
    const verifica = await Plataforma.findOne({
        where: {idCliente: dados.idCliente}
    })
  
    if (!verifica){
        console.log('ok')
        const plataforma = await Plataforma.create({
            nomeCliente: dados.nomeCliente,
            plataformaUrl: dados.url,
            plataformaNome: dados.plataformaNome,
            idCliente: dados.idCliente
        })
        plataforma.save()
    }
    res.status(200).json(dados)
})




app.listen(PORT, (req, res)=>{
    console.log(`SERVIDOR NO AR - PORTA ${PORT}`)
})
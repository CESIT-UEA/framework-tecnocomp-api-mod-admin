const express = require('express');
const router = express.Router();
const { setQuestaoAberta } = require('../services/exerciciosService');
const authMiddleware = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

router.patch('/topico/:id_topico/exercicio', authMiddleware, authorizeRole(['adm','professor']), 
    async (req, res) => {
        try {
            const { id_topico } = req.params;
            const { valor } = req.body;  // boleano que define se a questão é aberta
            
            await setQuestaoAberta(id_topico, valor);
            res.status(200).json({ message: `Questão aberta definida como ${valor}!` })
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    })


module.exports = router;
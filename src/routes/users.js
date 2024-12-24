const express = require("express");

const router = express.Router();
const userService = require("../services/usuario")

router.get('/listar-usuarios', async (req, res) => {
    try {
        let users = await userService.getDadosUser()
        res.status(200).json({ users : users });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
})

module.exports = router;
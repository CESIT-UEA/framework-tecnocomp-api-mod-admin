const express = require('express');
const router = express.Router();
const equipeService = require('../services/equipe');
const authMiddleware = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

/**
 * @swagger
 * /api/equipe:
 *   post:
 *     summary: Cria uma nova equipe
 *     tags: [Equipe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               ficha_tecnica_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Equipe criada
 *       400:
 *         description: Erro ao criar equipe
 */
router.post('/equipe', authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const equipe = await equipeService.criarEquipe(req.body);
    res.status(201).json(equipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/equipes/ficha/{ficha_tecnica_id}:
 *   get:
 *     summary: Lista equipes de uma ficha técnica
 *     tags: [Equipe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ficha_tecnica_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Equipes listadas
 *       400:
 *         description: Erro ao listar equipes
 */
router.get('/equipes/ficha/:ficha_tecnica_id', authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const equipes = await equipeService.listarEquipes(req.params.ficha_tecnica_id);
    res.status(200).json(equipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/**
 * @swagger
 * /api/equipe/{id}:
 *   put:
 *     summary: Atualiza uma equipe
 *     tags: [Equipe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Equipe atualizada
 *       404:
 *         description: Equipe não encontrada
 */
router.put('/equipe/:id', authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const equipe = await equipeService.atualizarEquipe(req.params.id, req.body);
    if (!equipe) return res.status(404).json({ error: 'Equipe não encontrada' });
    res.status(200).json(equipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/**
 * @swagger
 * /api/equipe/{id}:
 *   delete:
 *     summary: Remove uma equipe
 *     tags: [Equipe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Equipe deletada
 *       404:
 *         description: Equipe não encontrada
 */
router.delete('/equipe/:id', authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const deletado = await equipeService.deletarEquipe(req.params.id);
    if (!deletado) return res.status(404).json({ error: 'Equipe não encontrada' });
    res.status(200).json({ message: 'Equipe deletada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

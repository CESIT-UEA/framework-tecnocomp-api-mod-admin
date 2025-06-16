const express = require('express');
const router = express.Router();
const membroService = require('../services/membro');
const authMiddleware = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

/**
 * @swagger
 * /api/membro:
 *   post:
 *     summary: Cria um novo membro
 *     tags: [Membro]
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
 *               cargo:
 *                 type: string
 *               foto_url:
 *                 type: string
 *               equipe_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Membro criado
 *       400:
 *         description: Erro ao criar membro
 */
router.post('/membro', authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const membro = await membroService.criarMembro(req.body);
    res.status(201).json(membro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/**
 * @swagger
 * /api/membros/equipe/{equipe_id}:
 *   get:
 *     summary: Lista membros de uma equipe
 *     tags: [Membro]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: equipe_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de membros
 *       400:
 *         description: Erro ao listar membros
 */
router.get('/membros/equipe/:equipe_id', authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const membros = await membroService.listarMembros(req.params.equipe_id);
    res.status(200).json(membros);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/**
 * @swagger
 * /api/membro/{id}:
 *   put:
 *     summary: Atualiza um membro
 *     tags: [Membro]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Membro atualizado
 *       404:
 *         description: Membro não encontrado
 */
router.put('/membro/:id', authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const membro = await membroService.atualizarMembro(req.params.id, req.body);
    if (!membro) return res.status(404).json({ error: 'Membro não encontrado' });
    res.status(200).json(membro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/**
 * @swagger
 * /api/membro/{id}:
 *   delete:
 *     summary: Deleta um membro
 *     tags: [Membro]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Membro deletado
 *       404:
 *         description: Membro não encontrado
 */
router.delete('/membro/:id', authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const deletado = await membroService.deletarMembro(req.params.id);
    if (!deletado) return res.status(404).json({ error: 'Membro não encontrado' });
    res.status(200).json({ message: 'Membro deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

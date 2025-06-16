const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');
const referenciaService = require('../services/referenciaModulo');

/**
 * @swagger
 * /api/referencias-modulo:
 *   post:
 *     summary: Cria uma nova referência para um módulo
 *     tags: [Referência Módulo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *               link:
 *                 type: string
 *               modulo_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Referência criada com sucesso
 */
router.post('/referencias-modulo', authMiddleware, authorizeRole(['adm', 'professor']), async (req, res) => {
  try {
    const referencia = await referenciaService.criarReferencia(req.body);
    res.status(201).json(referencia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/referencias-modulo/modulo/{modulo_id}:
 *   get:
 *     summary: Lista todas as referências de um módulo
 *     tags: [Referência Módulo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: modulo_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de referências
 */
router.get('/referencias-modulo/modulo/:modulo_id', authMiddleware, async (req, res) => {
  try {
    const referencias = await referenciaService.listarReferenciasPorModulo(req.params.modulo_id);
    res.status(200).json(referencias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/referencias-modulo/{id}:
 *   put:
 *     summary: Atualiza uma referência de módulo
 *     tags: [Referência Módulo]
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
 *         description: Referência atualizada
 *       404:
 *         description: Referência não encontrada
 */
router.put('/referencias-modulo/:id', authMiddleware, authorizeRole(['adm', 'professor']), async (req, res) => {
  try {
    const referencia = await referenciaService.atualizarReferencia(req.params.id, req.body);
    if (!referencia) return res.status(404).json({ error: 'Referência não encontrada' });
    res.status(200).json(referencia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/referencias-modulo/{id}:
 *   delete:
 *     summary: Remove uma referência de módulo
 *     tags: [Referência Módulo]
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
 *         description: Referência removida
 *       404:
 *         description: Referência não encontrada
 */
router.delete('/referencias-modulo/:id', authMiddleware, authorizeRole(['adm', 'professor']), async (req, res) => {
  try {
    const sucesso = await referenciaService.deletarReferencia(req.params.id);
    if (!sucesso) return res.status(404).json({ error: 'Referência não encontrada' });
    res.status(200).json({ message: 'Referência removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

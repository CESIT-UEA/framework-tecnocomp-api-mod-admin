const express = require('express');
const plataformaService = require('../services/plataformaService');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const authorizeRole = require('../middleware/authorizeRole');

/**
 * @swagger
 * /api/plataforma:
 *   post:
 *     summary: Cria uma nova plataforma
 *     tags:
 *       - Plataforma
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
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Plataforma criada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/plataforma', authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const novaPlataforma = await plataformaService.criarPlataforma(req.body);
    res.status(201).json(novaPlataforma);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/plataforma:
 *   get:
 *     summary: Lista todas as plataformas
 *     tags:
 *       - Plataforma
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de plataformas retornada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/plataforma', authMiddleware,authorizeRole(['adm']), async (req, res) => {
  try {
    let page = parseInt(req.query.page)
    if (isNaN(page) || page < 1) page = 1;

    const plataformas = await plataformaService.listarPlataformasPaginadas(page);
    const infoPlataformas = await plataformaService.infoPaginacaoPlataformas();
  
    res.json({ plataformas, infoPlataformas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/plataforma/{id}:
 *   get:
 *     summary: Obtém uma plataforma pelo ID
 *     tags:
 *       - Plataforma
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plataforma encontrada
 *       404:
 *         description: Plataforma não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/plataforma/:id', authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const plataforma = await plataformaService.obterPlataformaPorId(req.params.id);
    if (!plataforma) {
      return res.status(404).json({ error: 'Plataforma não encontrada' });
    }
    res.json(plataforma);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/plataforma/{id}:
 *   put:
 *     summary: Atualiza uma plataforma
 *     tags:
 *       - Plataforma
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plataforma atualizada
 *       404:
 *         description: Plataforma não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/plataforma/:id', authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const plataformaAtualizada = await plataformaService.atualizarPlataforma(req.params.id, req.body);
    if (!plataformaAtualizada) {
      return res.status(404).json({ error: 'Plataforma não encontrada' });
    }
    res.json(plataformaAtualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/plataforma/{id}:
 *   delete:
 *     summary: Deleta uma plataforma
 *     tags:
 *       - Plataforma
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idAdm
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: senhaAdm
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Plataforma deletada
 *       404:
 *         description: Plataforma não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/plataforma/:id', authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try { 
    const { id } = req.params;
    const { idAdm, senhaAdm } = req.query;

    const sucesso = await plataformaService.deletarPlataforma(idAdm, senhaAdm, id);
    if (!sucesso) {
      return res.status(404).json({ error: 'Plataforma não encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/plataformas/usuario/{id}:
 *   get:
 *     summary: Lista plataformas associadas a um usuário
 *     tags:
 *       - Plataforma
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de plataformas do usuário
 *       404:
 *         description: Nenhuma plataforma encontrada para este usuário
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/plataformas/usuario/:id", authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const { id } = req.params;
    let page = parseInt(req.query.page)
    if (isNaN(page) || page < 1) page = 1;

    const plataformas = await plataformaService.obterPlataformasPaginadasPorUsuario(id, page);

    if (!plataformas || plataformas.length === 0) {
      return res.status(404).json({ message: "Nenhuma plataforma encontrada para este usuário." });
    }

    const infoPlataforma = await plataformaService.infoPlataformasPorUsuario(id) 

    res.status(200).json({plataformas, infoPlataforma});
  } catch (error) {
    console.error("Erro ao obter plataformas por usuário:", error);
    res.status(500).json({ error: "Erro ao obter plataformas por usuário." });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const vantagemService = require("../services/vantagem");
const authMiddleware = require("../middleware/auth");

/**
 * @swagger
 * /api/vantagens/{modulo_id}:
 *   get:
 *     summary: Lista todas as vantagens de um módulo
 *     tags: [Vantagens]
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
 *         description: Lista de vantagens retornada com sucesso
 *       500:
 *         description: Erro ao listar vantagens
 */
router.get("/vantagens/:modulo_id", authMiddleware, async (req, res) => {
  try {
    const lista = await vantagemService.listarVantagens(req.params.modulo_id);
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/**
 * @swagger
 * /api/vantagens:
 *   post:
 *     summary: Cria uma nova vantagem para um módulo
 *     tags: [Vantagens]
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
 *               modulo_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Vantagem criada com sucesso
 *       500:
 *         description: Erro ao criar vantagem
 */
router.post("/vantagens", authMiddleware, async (req, res) => {
  try {
    const nova = await vantagemService.criarVantagem(req.body);
    res.status(201).json(nova);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/**
 * @swagger
 * /api/vantagens/{id}:
 *   put:
 *     summary: Atualiza uma vantagem existente
 *     tags: [Vantagens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
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
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vantagem atualizada com sucesso
 *       404:
 *         description: Vantagem não encontrada
 *       500:
 *         description: Erro ao atualizar vantagem
 */
router.put("/vantagens/:id", authMiddleware, async (req, res) => {
  try {
    const atualizada = await vantagemService.atualizarVantagem(
      req.params.id,
      req.body
    );
    if (!atualizada)
      return res.status(404).json({ error: "Vantagem não encontrada" });
    res.json(atualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/**
 * @swagger
 * /api/vantagens/{id}:
 *   delete:
 *     summary: Remove uma vantagem
 *     tags: [Vantagens]
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
 *         description: Vantagem removida com sucesso
 *       404:
 *         description: Vantagem não encontrada
 *       500:
 *         description: Erro ao remover vantagem
 */
router.delete("/vantagens/:id", authMiddleware, async (req, res) => {
  try {
    const sucesso = await vantagemService.deletarVantagem(req.params.id);
    if (!sucesso)
      return res.status(404).json({ error: "Vantagem não encontrada" });
    res.json({ message: "Vantagem removida com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

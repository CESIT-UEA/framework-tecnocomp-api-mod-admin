const express = require("express");
const moduloService = require("../services/modulo");
const topicoService = require("../services/topico");
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const multer = require("multer");
const path = require("path");
const authorizeRole = require('../middleware/authorizeRole');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/routes/uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  },
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/modulo:
 *   post:
 *     summary: Cria um novo módulo
 *     tags: [Módulo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_modulo:
 *                 type: string
 *               video_inicial:
 *                 type: string
 *               ebookUrlGeral:
 *                 type: string
 *               nome_url:
 *                 type: string
 *               usuario_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Módulo criado com sucesso
 *       400:
 *         description: Erro ao criar módulo
 */
router.post("/modulo", authMiddleware,authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  const { nome_modulo, video_inicial, ebookUrlGeral, nome_url, usuario_id } = req.body;

  try {
    const modulo = await moduloService.criarModulo({
      nome_modulo,
      video_inicial,
      ebookUrlGeral,
      nome_url,
      usuario_id,
    });

    res.status(201).json({ modulo });
  } catch (error) {
    console.error("Erro ao criar módulo:", error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/modulos:
 *   get:
 *     summary: Lista todos os módulos
 *     tags: [Módulo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de módulos
 *       500:
 *         description: Erro ao listar módulos
 */
router.get("/modulos", authMiddleware,authorizeRole(['adm']), async (req, res) => {
  try {
    const modulos = await moduloService.listarModulos();
    res.status(200).json(modulos);
  } catch (error) {
    console.error("Erro ao listar módulos:", error);
    res.status(500).json({ error: "Erro ao listar módulos" });
  }
});

/**
 * @swagger
 * /api/modulos/{id}:
 *   put:
 *     summary: Atualiza um módulo
 *     tags: [Módulo]
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
 *     responses:
 *       200:
 *         description: Módulo atualizado
 *       404:
 *         description: Módulo não encontrado
 */
router.put("/modulos/:id", authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;
    const moduloAtualizado = await moduloService.atualizarModulo(id, dadosAtualizados);
    if (!moduloAtualizado) {
      return res.status(404).json({ error: "Módulo não encontrado" });
    }
    res.status(200).json(moduloAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar módulo:", error);
    res.status(500).json({ error: "Erro ao atualizar módulo" });
  }
});

/**
 * @swagger
 * /api/modulos/{id}:
 *   delete:
 *     summary: Deleta um módulo
 *     tags: [Módulo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: idAdm
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *       - name: senhaAdm
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Módulo deletado
 *       404:
 *         description: Módulo não encontrado
 */
router.delete("/modulos/:id", authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { idAdm, senhaAdm } = req.query;

    const deletado = await moduloService.deletarModulo(idAdm, senhaAdm, id);
    if (!deletado) {
      return res.status(404).json({ error: "Módulo não encontrado" });
    }
    res.status(200).json({ message: "Módulo deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar módulo:", error);
    res.status(500).json({ error: "Erro ao deletar módulo" });
  }
});

/**
 * @swagger
 * /api/modulos/{id}/publicar:
 *   patch:
 *     summary: Atualiza o status de publicação do módulo
 *     tags: [Módulo]
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
 *               publicar:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status atualizado
 *       404:
 *         description: Módulo não encontrado
 */
router.patch('/modulos/:id/publicar', authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { publicar } = req.body;

    if (publicar === undefined) {
      return res.status(400).json({ error: 'O campo "publicar" é obrigatório' });
    }

    const moduloAtualizado = await moduloService.atualizarStatusPublicacao(id, publicar);

    if (!moduloAtualizado) {
      return res.status(404).json({ error: 'Módulo não encontrado' });
    }

    res.status(200).json(moduloAtualizado);
  } catch (error) {
    console.error('Erro ao alterar status de publicação:', error);
    res.status(500).json({ error: 'Erro ao alterar status de publicação' });
  }
});

/**
 * @swagger
 * /api/modulo/{id}:
 *   get:
 *     summary: Obtém um módulo por ID com seus tópicos
 *     tags: [Módulo]
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
 *         description: Módulo retornado com sucesso
 *       404:
 *         description: Módulo não encontrado
 */
router.get("/modulo/:id", authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const { id } = req.params;
    const modulo = await moduloService.obterModuloPorIdESeusTopicos(id);
    if (!modulo) {
      return res.status(404).json({ error: "Módulo não encontrado" });
    }
    res.status(200).json(modulo);
  } catch (error) {
    console.error("Erro ao buscar módulo:", error);
    res.status(500).json({ error: "Erro ao buscar módulo" });
  }
});

/**
 * @swagger
 * /api/modulos/usuario/{id}:
 *   get:
 *     summary: Lista módulos por usuário
 *     tags: [Módulo]
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
 *         description: Módulos encontrados
 *       404:
 *         description: Nenhum módulo encontrado
 */
router.get("/modulos/usuario/:id", authMiddleware,authorizeRole(['adm','professor']), async (req, res) => {
  try {
    const { id } = req.params;
    const modulos = await moduloService.obterModulosPorUsuario(id);

    if (!modulos || modulos.length === 0) {
      return res.status(404).json({ message: "Nenhum módulo encontrado para este usuário." });
    }

    res.status(200).json(modulos);
  } catch (error) {
    console.error("Erro ao obter módulos por usuário:", error);
    res.status(500).json({ error: "Erro ao obter módulos por usuário." });
  }
});

/**
 * @swagger
 * /api/modulos/upload:
 *   post:
 *     summary: Faz upload de um arquivo
 *     tags: [Módulo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Arquivo salvo com sucesso
 *       500:
 *         description: Erro ao salvar arquivo
 */
router.post("/modulos/upload", authMiddleware, upload.single("file"),authorizeRole(['adm','professor']), async (req, res) => {
  try {
    res.status(200).json({
      message: "Arquivo salvo com sucesso",
      filePath: path.join(__dirname, "uploads", req.file.filename),
      fileName: req.file.filename,
    });
  } catch (error) {
    console.error("Erro ao salvar arquivo:", error);
    res.status(500).json({ error: "Arquivo não foi salvo" });
  }
});

/**
 * @swagger
 * /api/modulos/file/{name}:
 *   get:
 *     summary: Retorna um arquivo pelo nome
 *     tags: [Módulo]
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arquivo retornado
 */
router.get('/modulos/file/:name', (req, res) => {
  res.sendFile(__dirname  +'/uploads/' + req.params.name);
});

module.exports = router;

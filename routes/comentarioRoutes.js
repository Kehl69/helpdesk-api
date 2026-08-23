const express = require('express');
const router = express.Router({ mergeParams: true });
const ComentarioController = require('../controllers/comentarioController');

/**
 * @openapi
 * /api/chamados/{chamadoId}/comentarios:
 *   get:
 *     tags: [Comentarios]
 *     summary: Lista os comentarios de acompanhamento de um chamado
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: chamadoId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Lista de comentarios }
 *       403: { description: Acesso negado }
 *       404: { description: Chamado nao encontrado }
 */
router.get('/', ComentarioController.listar);

/**
 * @openapi
 * /api/chamados/{chamadoId}/comentarios:
 *   post:
 *     tags: [Comentarios]
 *     summary: Adiciona um comentario de acompanhamento a um chamado
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: chamadoId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mensagem]
 *             properties:
 *               mensagem: { type: string, example: "Ja verificamos o cabo de energia." }
 *     responses:
 *       201: { description: Comentario criado }
 *       400: { description: Dados invalidos }
 *       403: { description: Acesso negado }
 *       404: { description: Chamado nao encontrado }
 */
router.post('/', ComentarioController.criar);

module.exports = router;

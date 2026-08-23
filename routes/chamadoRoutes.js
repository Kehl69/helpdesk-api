const express = require('express');
const router = express.Router();
const ChamadoController = require('../controllers/chamadoController');
const comentarioRoutes = require('./comentarioRoutes');
const { autenticar, exigirTecnico } = require('../middlewares/authMiddleware');

router.use(autenticar);

/**
 * @openapi
 * /api/chamados:
 *   get:
 *     tags: [Chamados]
 *     summary: Lista chamados (clientes veem apenas os proprios; tecnicos veem todos)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: ["Aberto", "Em Atendimento", "Concluido"] }
 *         description: Filtra os chamados por status
 *     responses:
 *       200: { description: Lista de chamados }
 *       401: { description: Token ausente ou invalido }
 */
router.get('/', ChamadoController.listar);

/**
 * @openapi
 * /api/chamados/{id}:
 *   get:
 *     tags: [Chamados]
 *     summary: Retorna os detalhes de um chamado
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Chamado encontrado }
 *       403: { description: Acesso negado }
 *       404: { description: Chamado nao encontrado }
 */
router.get('/:id', ChamadoController.buscar);

/**
 * @openapi
 * /api/chamados:
 *   post:
 *     tags: [Chamados]
 *     summary: Abre um novo chamado de suporte
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo]
 *             properties:
 *               titulo: { type: string, example: "Impressora nao funciona" }
 *               descricao: { type: string, example: "A impressora do setor financeiro nao liga." }
 *               prioridade: { type: string, enum: [Baixa, Media, Alta], example: "Media" }
 *     responses:
 *       201: { description: Chamado criado }
 *       400: { description: Dados invalidos }
 */
router.post('/', ChamadoController.criar);

/**
 * @openapi
 * /api/chamados/{id}/status:
 *   patch:
 *     tags: [Chamados]
 *     summary: Atualiza o status de um chamado (somente tecnicos)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: ["Aberto", "Em Atendimento", "Concluido"] }
 *     responses:
 *       200: { description: Status atualizado }
 *       400: { description: Status invalido }
 *       403: { description: Acesso restrito a tecnicos }
 *       404: { description: Chamado nao encontrado }
 */
router.patch('/:id/status', exigirTecnico, ChamadoController.atualizarStatus);

/**
 * @openapi
 * /api/chamados/{id}:
 *   delete:
 *     tags: [Chamados]
 *     summary: Remove um chamado definitivamente (somente tecnicos)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Chamado removido }
 *       403: { description: Acesso restrito a tecnicos }
 *       404: { description: Chamado nao encontrado }
 */
router.delete('/:id', exigirTecnico, ChamadoController.remover);

router.use('/:chamadoId/comentarios', comentarioRoutes);

module.exports = router;

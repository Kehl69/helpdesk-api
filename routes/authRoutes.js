const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

/**
 * @openapi
 * /auth/cadastro:
 *   post:
 *     tags: [Autenticacao]
 *     summary: Cadastra um novo usuario (cliente ou tecnico)
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome: { type: string, example: "Maria Silva" }
 *               email: { type: string, example: "maria@exemplo.com" }
 *               senha: { type: string, example: "senha123" }
 *               tipo: { type: string, enum: [cliente, tecnico], example: "cliente" }
 *     responses:
 *       201: { description: Usuario criado com sucesso }
 *       400: { description: Dados invalidos }
 *       409: { description: E-mail ja cadastrado }
 */
router.post('/cadastro', AuthController.cadastrar);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Autenticacao]
 *     summary: Autentica um usuario e retorna um token JWT
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email: { type: string, example: "maria@exemplo.com" }
 *               senha: { type: string, example: "senha123" }
 *     responses:
 *       200: { description: Login realizado com sucesso, retorna o token JWT }
 *       401: { description: Credenciais invalidas }
 */
router.post('/login', AuthController.login);

module.exports = router;

/**
 * Controller responsavel por cadastro e login de usuarios, emitindo JWT.
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuarioModel');

const AuthController = {
  /**
   * Cadastra um novo usuario (cliente ou tecnico) com senha hasheada via bcrypt.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @throws {Error} erros inesperados sao repassados ao errorHandler global
   */
  async cadastrar(req, res, next) {
    try {
      const { nome, email, senha, tipo } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: 'Nome, email e senha sao obrigatorios.' });
      }

      const existente = await UsuarioModel.buscarPorEmail(email);
      if (existente) {
        return res.status(409).json({ sucesso: false, mensagem: 'Ja existe uma conta com este e-mail.' });
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      const tipoValido = tipo === 'tecnico' ? 'tecnico' : 'cliente';

      const id = await UsuarioModel.criar({ nome, email, senhaHash, tipo: tipoValido });

      res.status(201).json({ sucesso: true, dados: { id, nome, email, tipo: tipoValido } });
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Autentica um usuario e retorna um JWT valido por JWT_EXPIRES_IN.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @throws {Error} erros inesperados sao repassados ao errorHandler global
   */
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: 'Email e senha sao obrigatorios.' });
      }

      const usuario = await UsuarioModel.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ sucesso: false, mensagem: 'Credenciais invalidas.' });
      }

      const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaConfere) {
        return res.status(401).json({ sucesso: false, mensagem: 'Credenciais invalidas.' });
      }

      const payload = { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '8h'
      });

      res.json({ sucesso: true, dados: { token, usuario: payload } });
    } catch (erro) {
      next(erro);
    }
  }
};

module.exports = AuthController;

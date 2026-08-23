/**
 * Controller responsavel pelos comentarios de acompanhamento de um chamado.
 */
const ChamadoModel = require('../models/chamadoModel');
const ComentarioModel = require('../models/comentarioModel');

const ComentarioController = {
  /**
   * Lista os comentarios de um chamado, validando acesso do cliente.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @throws {Error} erros inesperados sao repassados ao errorHandler global
   */
  async listar(req, res, next) {
    try {
      const chamado = await ChamadoModel.buscarPorId(req.params.chamadoId);
      if (!chamado) {
        return res.status(404).json({ sucesso: false, mensagem: 'Chamado nao encontrado.' });
      }
      if (req.usuario.tipo === 'cliente' && chamado.cliente_id !== req.usuario.id) {
        return res.status(403).json({ sucesso: false, mensagem: 'Voce nao tem acesso a este chamado.' });
      }

      const comentarios = await ComentarioModel.listarPorChamado(req.params.chamadoId);
      res.json({ sucesso: true, dados: comentarios });
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Adiciona um comentario a um chamado, validando acesso do cliente.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @throws {Error} erros inesperados sao repassados ao errorHandler global
   */
  async criar(req, res, next) {
    try {
      const { mensagem } = req.body;
      if (!mensagem) {
        return res.status(400).json({ sucesso: false, mensagem: 'A mensagem e obrigatoria.' });
      }

      const chamado = await ChamadoModel.buscarPorId(req.params.chamadoId);
      if (!chamado) {
        return res.status(404).json({ sucesso: false, mensagem: 'Chamado nao encontrado.' });
      }
      if (req.usuario.tipo === 'cliente' && chamado.cliente_id !== req.usuario.id) {
        return res.status(403).json({ sucesso: false, mensagem: 'Voce nao tem acesso a este chamado.' });
      }

      const id = await ComentarioModel.criar({
        chamadoId: req.params.chamadoId,
        usuarioId: req.usuario.id,
        mensagem
      });

      res.status(201).json({ sucesso: true, dados: { id, mensagem } });
    } catch (erro) {
      next(erro);
    }
  }
};

module.exports = ComentarioController;

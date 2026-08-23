/**
 * Controller responsavel pelo CRUD de chamados de suporte.
 */
const ChamadoModel = require('../models/chamadoModel');

const STATUS_VALIDOS = ['Aberto', 'Em Atendimento', 'Concluido'];

const ChamadoController = {
  /**
   * Lista chamados. Clientes veem apenas os proprios chamados; tecnicos veem todos.
   * Aceita o query param opcional "status" para filtrar.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @throws {Error} erros inesperados sao repassados ao errorHandler global
   */
  async listar(req, res, next) {
    try {
      const { status } = req.query;

      if (status && !STATUS_VALIDOS.includes(status)) {
        return res.status(400).json({ sucesso: false, mensagem: 'Status invalido.' });
      }

      const chamados = await ChamadoModel.listar({
        usuarioId: req.usuario.id,
        tipo: req.usuario.tipo,
        status
      });

      res.json({ sucesso: true, dados: chamados });
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Retorna os detalhes de um chamado especifico, validando propriedade quando for cliente.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @throws {Error} erros inesperados sao repassados ao errorHandler global
   */
  async buscar(req, res, next) {
    try {
      const chamado = await ChamadoModel.buscarPorId(req.params.id);

      if (!chamado) {
        return res.status(404).json({ sucesso: false, mensagem: 'Chamado nao encontrado.' });
      }

      if (req.usuario.tipo === 'cliente' && chamado.cliente_id !== req.usuario.id) {
        return res.status(403).json({ sucesso: false, mensagem: 'Voce nao tem acesso a este chamado.' });
      }

      res.json({ sucesso: true, dados: chamado });
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Abre um novo chamado em nome do cliente autenticado.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @throws {Error} erros inesperados sao repassados ao errorHandler global
   */
  async criar(req, res, next) {
    try {
      const { titulo, descricao, prioridade } = req.body;

      if (!titulo) {
        return res.status(400).json({ sucesso: false, mensagem: 'O titulo e obrigatorio.' });
      }

      const id = await ChamadoModel.criar({
        titulo,
        descricao,
        prioridade,
        clienteId: req.usuario.id
      });

      const chamado = await ChamadoModel.buscarPorId(id);
      res.status(201).json({ sucesso: true, dados: chamado });
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Atualiza o status de um chamado (e opcionalmente atribui um tecnico). Somente tecnicos.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @throws {Error} erros inesperados sao repassados ao errorHandler global
   */
  async atualizarStatus(req, res, next) {
    try {
      const { status } = req.body;

      if (!status || !STATUS_VALIDOS.includes(status)) {
        return res.status(400).json({
          sucesso: false,
          mensagem: `Status invalido. Use um dos: ${STATUS_VALIDOS.join(', ')}`
        });
      }

      const chamado = await ChamadoModel.buscarPorId(req.params.id);
      if (!chamado) {
        return res.status(404).json({ sucesso: false, mensagem: 'Chamado nao encontrado.' });
      }

      const tecnicoId = status === 'Em Atendimento' && !chamado.tecnico_id
        ? req.usuario.id
        : undefined;

      await ChamadoModel.atualizarStatus(req.params.id, { status, tecnicoId });

      const atualizado = await ChamadoModel.buscarPorId(req.params.id);
      res.json({ sucesso: true, dados: atualizado });
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Remove um chamado definitivamente. Somente tecnicos.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @throws {Error} erros inesperados sao repassados ao errorHandler global
   */
  async remover(req, res, next) {
    try {
      const chamado = await ChamadoModel.buscarPorId(req.params.id);
      if (!chamado) {
        return res.status(404).json({ sucesso: false, mensagem: 'Chamado nao encontrado.' });
      }
      await ChamadoModel.remover(req.params.id);
      res.json({ sucesso: true, mensagem: 'Chamado removido com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  }
};

module.exports = ChamadoController;

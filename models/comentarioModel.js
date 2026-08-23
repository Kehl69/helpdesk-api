/**
 * Model responsavel pelo acesso a tabela `comentarios_chamado`.
 */
const pool = require('../config/db');

const ComentarioModel = {
  /**
   * Lista os comentarios de um chamado, do mais antigo para o mais novo.
   * @async
   * @param {number} chamadoId
   * @returns {Promise<Array<Object>>}
   */
  async listarPorChamado(chamadoId) {
    const [rows] = await pool.execute(
      `SELECT cc.*, u.nome AS autor_nome, u.tipo AS autor_tipo
       FROM comentarios_chamado cc
       JOIN usuarios u ON u.id = cc.usuario_id
       WHERE cc.chamado_id = ?
       ORDER BY cc.criado_em ASC`,
      [chamadoId]
    );
    return rows;
  },

  /**
   * Adiciona um comentario a um chamado.
   * @async
   * @param {{chamadoId:number, usuarioId:number, mensagem:string}} dados
   * @returns {Promise<number>}
   */
  async criar({ chamadoId, usuarioId, mensagem }) {
    const [result] = await pool.execute(
      'INSERT INTO comentarios_chamado (chamado_id, usuario_id, mensagem) VALUES (?, ?, ?)',
      [chamadoId, usuarioId, mensagem]
    );
    return result.insertId;
  }
};

module.exports = ComentarioModel;

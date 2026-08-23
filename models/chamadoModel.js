/**
 * Model responsavel pelo acesso a tabela `chamados`.
 */
const pool = require('../config/db');

const ChamadoModel = {
  /**
   * Lista chamados. Clientes veem apenas os proprios; tecnicos veem todos.
   * @async
   * @param {{usuarioId:number, tipo:string, status?:string}} filtro
   * @returns {Promise<Array<Object>>}
   */
  async listar({ usuarioId, tipo, status }) {
    let sql = `
      SELECT c.*, cli.nome AS cliente_nome, tec.nome AS tecnico_nome
      FROM chamados c
      JOIN usuarios cli ON cli.id = c.cliente_id
      LEFT JOIN usuarios tec ON tec.id = c.tecnico_id
      WHERE 1 = 1
    `;
    const params = [];

    if (tipo === 'cliente') {
      sql += ' AND c.cliente_id = ?';
      params.push(usuarioId);
    }

    if (status) {
      sql += ' AND c.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY c.criado_em DESC';

    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  /**
   * Busca um chamado pelo id.
   * @async
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async buscarPorId(id) {
    const [rows] = await pool.execute(
      `SELECT c.*, cli.nome AS cliente_nome, tec.nome AS tecnico_nome
       FROM chamados c
       JOIN usuarios cli ON cli.id = c.cliente_id
       LEFT JOIN usuarios tec ON tec.id = c.tecnico_id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Cria um novo chamado aberto por um cliente.
   * @async
   * @param {{titulo:string, descricao:string, prioridade:string, clienteId:number}} dados
   * @returns {Promise<number>}
   */
  async criar({ titulo, descricao, prioridade, clienteId }) {
    const [result] = await pool.execute(
      `INSERT INTO chamados (titulo, descricao, prioridade, cliente_id, status)
       VALUES (?, ?, ?, ?, 'Aberto')`,
      [titulo, descricao, prioridade || 'Media', clienteId]
    );
    return result.insertId;
  },

  /**
   * Atualiza o status (e opcionalmente o tecnico responsavel) de um chamado.
   * @async
   * @param {number} id
   * @param {{status:string, tecnicoId?:number|null}} dados
   * @returns {Promise<void>}
   */
  async atualizarStatus(id, { status, tecnicoId }) {
    if (tecnicoId !== undefined) {
      await pool.execute(
        'UPDATE chamados SET status = ?, tecnico_id = ? WHERE id = ?',
        [status, tecnicoId, id]
      );
    } else {
      await pool.execute('UPDATE chamados SET status = ? WHERE id = ?', [status, id]);
    }
  },

  /**
   * Remove (encerra definitivamente) um chamado.
   * @async
   * @param {number} id
   * @returns {Promise<void>}
   */
  async remover(id) {
    await pool.execute('DELETE FROM chamados WHERE id = ?', [id]);
  }
};

module.exports = ChamadoModel;

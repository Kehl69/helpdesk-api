/**
 * Model responsavel pelo acesso a tabela `usuarios`.
 * Todas as queries usam prepared statements (mysql2) para evitar SQL Injection.
 */
const pool = require('../config/db');

const UsuarioModel = {
  /**
   * Busca um usuario pelo e-mail.
   * @async
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async buscarPorEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0] || null;
  },

  /**
   * Busca um usuario pelo id (sem retornar o hash da senha).
   * @async
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async buscarPorId(id) {
    const [rows] = await pool.execute(
      'SELECT id, nome, email, tipo FROM usuarios WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Lista todos os tecnicos cadastrados.
   * @async
   * @returns {Promise<Array<Object>>}
   */
  async listarTecnicos() {
    const [rows] = await pool.execute(
      "SELECT id, nome, email FROM usuarios WHERE tipo = 'tecnico'"
    );
    return rows;
  },

  /**
   * Cria um novo usuario. A senha ja deve chegar com hash (bcrypt).
   * @async
   * @param {{nome:string, email:string, senhaHash:string, tipo:string}} dados
   * @returns {Promise<number>} id do usuario criado
   */
  async criar({ nome, email, senhaHash, tipo }) {
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nome, email, senha_hash, tipo) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, tipo]
    );
    return result.insertId;
  }
};

module.exports = UsuarioModel;

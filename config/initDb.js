/**
 * Script utilitario para criar as tabelas no banco caso ainda nao existam.
 * Executar uma vez com: npm run initdb
 */
require('dotenv').config();
const pool = require('./db');

/**
 * Cria as tabelas usuarios, chamados e comentarios_chamado.
 * @async
 * @returns {Promise<void>}
 */
async function initDb() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(120) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        senha_hash VARCHAR(255) NOT NULL,
        tipo ENUM('cliente','tecnico') NOT NULL DEFAULT 'cliente',
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS chamados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(150) NOT NULL,
        descricao TEXT,
        status ENUM('Aberto','Em Atendimento','Concluido') NOT NULL DEFAULT 'Aberto',
        prioridade ENUM('Baixa','Media','Alta') NOT NULL DEFAULT 'Media',
        cliente_id INT NOT NULL,
        tecnico_id INT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (tecnico_id) REFERENCES usuarios(id) ON DELETE SET NULL
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS comentarios_chamado (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chamado_id INT NOT NULL,
        usuario_id INT NOT NULL,
        mensagem TEXT NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chamado_id) REFERENCES chamados(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);

    console.log('Tabelas criadas/verificadas com sucesso.');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao inicializar o banco:', err);
    process.exit(1);
  }
}

initDb();

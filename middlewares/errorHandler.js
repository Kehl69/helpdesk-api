/**
 * Middleware global de tratamento de erros.
 * Garante que nenhum stack trace ou detalhe interno vaze para o cliente em producao.
 */
function errorHandler(err, req, res, next) {
  console.error('Erro nao tratado:', err);
  res.status(500).json({
    sucesso: false,
    mensagem: 'Erro interno no servidor. Tente novamente mais tarde.'
  });
}

module.exports = errorHandler;

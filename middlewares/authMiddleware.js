/**
 * Middleware de autenticacao via JWT para a API REST HelpDesk.
 * Espera o token no cabecalho: Authorization: Bearer <token>
 */
const jwt = require('jsonwebtoken');

/**
 * Verifica se o token JWT enviado no header Authorization e valido.
 * Em caso de sucesso, popula req.usuario com { id, nome, tipo }.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ sucesso: false, mensagem: 'Token nao fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, nome, tipo }
    next();
  } catch (erro) {
    return res.status(401).json({ sucesso: false, mensagem: 'Token invalido ou expirado.' });
  }
}

/**
 * Restringe o acesso a usuarios do tipo "tecnico".
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function exigirTecnico(req, res, next) {
  if (!req.usuario || req.usuario.tipo !== 'tecnico') {
    return res.status(403).json({ sucesso: false, mensagem: 'Acesso restrito a tecnicos.' });
  }
  next();
}

module.exports = { autenticar, exigirTecnico };

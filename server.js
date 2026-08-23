/**
 * Ponto de entrada da API HelpDesk (arquitetura REST desacoplada).
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./swagger/swaggerConfig');
const authRoutes = require('./routes/authRoutes');
const chamadoRoutes = require('./routes/chamadoRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// CORS: aceita requisicoes somente da URL configurada do front-end.
// Em desenvolvimento, se FRONTEND_URL nao estiver definida, libera geral para facilitar testes locais.
const origensPermitidas = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : true;

app.use(cors({ origin: origensPermitidas }));
app.use(express.json());

// Documentacao interativa Swagger/OpenAPI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'HelpDesk API no ar. Veja a documentacao em /api-docs.'
  });
});

app.use('/auth', authRoutes);
app.use('/api/chamados', chamadoRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ sucesso: false, mensagem: 'Rota nao encontrada.' });
});

// Tratamento global de erros - nunca vaza stack trace em producao
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`HelpDesk API rodando na porta ${PORT}`);
  console.log(`Documentacao Swagger disponivel em /api-docs`);
});

/**
 * Configuracao do Swagger/OpenAPI para a API HelpDesk.
 * A especificacao e gerada a partir dos comentarios JSDoc/OpenAPI nas rotas.
 */
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HelpDesk API',
      version: '1.0.0',
      description: 'API REST para gestao de chamados e suporte tecnico (HelpDesk).'
    },
    servers: [
      { url: '/', description: 'Servidor atual' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

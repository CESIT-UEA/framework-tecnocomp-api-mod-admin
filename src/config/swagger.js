const swaggerJSDoc = require("swagger-jsdoc");
require("dotenv").config();
let url;

if (process.env.PRODUCAO_VARIAVEL == "true") {
  url = "https://172.25.1.5:3001"
} else {
  url = "http://localhost:3001"
}

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Usuários",
      version: "1.0.0",
      description:
        "Documentação da API para gerenciamento de usuários com autenticação JWT",
    },
    servers: [
      {
        url: url,
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

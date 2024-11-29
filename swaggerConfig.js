const swaggerJsDoc = require("swagger-jsdoc");

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "QR Code Management API",
            description: "API documentation for user authentication and QR code generation",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local Development Server",
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
    apis: ["./routes/*.js", "./models/*.js"], // Path to files containing Swagger annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;

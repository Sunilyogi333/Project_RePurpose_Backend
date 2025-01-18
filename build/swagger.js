"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'CHILD-THRIFT-STORE API',
        version: '1.0.0',
    },
    components: {
        securitySchemes: {
            Authorization: {
                type: 'apiKey',
                in: 'header',
                description: 'All requests to the API should contain an Authorization header with your API Token : NOTE [Add Bearer before token] ',
                name: 'Authorization',
            },
        },
    },
    servers: [
        {
            url: 'http://localhost:5000/api/v1',
            description: 'Development server',
        },
        {
            url: 'https://child-thrift-backend.vercel.app/api/v1',
            description: 'Production server',
        },
    ],
};
const options = {
    swaggerDefinition,
    apis: ['src/routes/**/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
//# sourceMappingURL=swagger.js.map
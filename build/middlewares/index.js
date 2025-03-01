"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("../routes"));
const morgan_1 = __importDefault(require("morgan"));
const rateLimiter_utils_1 = require("../utils/rateLimiter.utils");
const env_config_1 = require("../config/env.config");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("../swagger"));
const error_middleware_1 = __importDefault(require("./error.middleware"));
const middleware = (app) => {
    app.use((0, compression_1.default)());
    app.use((0, cors_1.default)({
        origin: true,
        credentials: true,
    }));
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.json({ limit: '20mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '20mb' }));
    app.use(rateLimiter_utils_1.rateLimiter);
    app.use((0, morgan_1.default)('dev'));
    app.use('/api', routes_1.default);
    app.get('/', (req, res) => {
        res.send({
            success: true,
            message: 'welcomeMessage',
            data: [],
        });
    });
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
    console.log('Environment:', env_config_1.EnvironmentConfiguration.NODE_ENV);
    app.use(error_middleware_1.default);
};
exports.default = middleware;
//# sourceMappingURL=index.js.map
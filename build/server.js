"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const mongoose_connection_1 = __importDefault(require("./db/mongoose.connection"));
const env_config_1 = require("./config/env.config");
const middlewares_1 = __importDefault(require("./middlewares"));
const app = (0, express_1.default)();
function bootStrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongoose_connection_1.default)();
            yield (0, middlewares_1.default)(app);
            app.listen(env_config_1.EnvironmentConfiguration.PORT, () => {
                console.info(`Server started at http://localhost:${env_config_1.EnvironmentConfiguration.PORT}`);
            });
        }
        catch (error) {
            console.error('Error during server setup:', error);
            process.exit(1);
        }
    });
}
bootStrap();
//# sourceMappingURL=server.js.map
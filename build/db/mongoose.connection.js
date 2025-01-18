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
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("../config/env.config");
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Connecting to database:', env_config_1.EnvironmentConfiguration.DB_NAME);
    try {
        const connection = yield mongoose_1.default.connect(`${env_config_1.EnvironmentConfiguration.MONGODB_URL}/${env_config_1.EnvironmentConfiguration.DB_NAME}`);
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
});
exports.default = connectDb;
//# sourceMappingURL=mongoose.connection.js.map
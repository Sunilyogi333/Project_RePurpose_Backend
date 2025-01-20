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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const titleTOCase_1 = require("../utils/titleTOCase");
const getValidationMessage = (errors, message) => {
    errors.forEach((err) => {
        if (err.children && err.children.length > 0) {
            getValidationMessage(err.children, message);
        }
        else {
            if (err.constraints) {
                Object.values(err.constraints).forEach((value) => {
                    const caseValue = (0, titleTOCase_1.titleNameToCase)(value);
                    message.push(caseValue);
                });
            }
        }
    });
};
class RequestValidator {
}
_a = RequestValidator;
RequestValidator.validate = (classInstance) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const convertedObject = (0, class_transformer_1.plainToClass)(classInstance, req.body);
        const validationMessages = [];
        const errors = yield (0, class_validator_1.validate)(convertedObject, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });
        if (errors.length !== 0) {
            getValidationMessage(errors, validationMessages);
            return next(HttpException_1.default.Forbidden(validationMessages[0]));
        }
        return next();
    });
};
exports.default = RequestValidator;
//# sourceMappingURL=Request.Validator.js.map
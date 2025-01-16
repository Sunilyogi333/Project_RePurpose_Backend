import { ClassConstructor, plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/HttpException';
import { titleNameToCase } from '../utils/titleTOCase';

// * to get the nested object error
const getValidationMessage = (errors: ValidationError[], message: string[]) => {
  errors.forEach((err) => {
    // Check if there are nested validation errors
    if (err.children && err.children.length > 0) {
      getValidationMessage(err.children, message);
    } else {
      if (err.constraints) {
        // Extract and format each error message
        Object.values(err.constraints).forEach((value) => {
          const caseValue = titleNameToCase(value);
          message.push(caseValue);
        });
      }
    }
  });
};

export default class RequestValidator {
  static validate = <T extends object>(classInstance: ClassConstructor<T>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      // * Convert request body to a class instance
      const convertedObject = plainToClass(classInstance, req.body);

      // * Validate the class instance
      const validationMessages: string[] = [];
      const errors = await validate(convertedObject, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      // * Check for validation errors
      if (errors.length !== 0) {
        // * Sanitize the error messages
        getValidationMessage(errors, validationMessages);

        // Always send the first validation message to the frontend
        return next(HttpException.Forbidden(validationMessages[0]));
      }

      // Use 'return' for consistency and clarity
      return next();
    };
  };
}

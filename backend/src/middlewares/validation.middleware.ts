import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  };
};

export const occurrenceValidation = [
  // body('type').isIn(['acidente', 'resgate', 'incendio', 'atropelamento', 'outros']),
  // body('municipality').notEmpty(),
  // body('address').notEmpty(),
  // body('occurrenceDate').isISO8601(),
  // body('activationDate').isISO8601(),
  // body('description').notEmpty()
];

export const userValidation = [
  // body('name').notEmpty(),
  // body('email').isEmail(),
  // body('password').isLength({ min: 6 }),
  // body('role').optional().isIn(['admin', 'supervisor', 'user', 'operator'])
];

export const loginValidation = [
  // body('email').isEmail(),
  // body('password').notEmpty()
];
import { body } from 'express-validator';
import { USER_ROLES } from '../constants/occurrence.types';

export const createUserValidator = [
  body('name')
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('email')
    .notEmpty().withMessage('Email é obrigatório')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Senha deve conter letra maiúscula, minúscula, número e caractere especial'),
  
  body('role')
    .optional()
    .isIn(USER_ROLES).withMessage(`Role inválido. Use: ${USER_ROLES.join(', ')}`),
  
  body('registration')
    .optional()
    .isLength({ max: 20 }).withMessage('Matrícula deve ter no máximo 20 caracteres'),
  
  body('unit')
    .optional()
    .isLength({ max: 50 }).withMessage('Unidade deve ter no máximo 50 caracteres')
];

export const updateUserValidator = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  
  body('role')
    .optional()
    .isIn(USER_ROLES).withMessage(`Role inválido. Use: ${USER_ROLES.join(', ')}`),
  
  body('registration')
    .optional()
    .isLength({ max: 20 }).withMessage('Matrícula deve ter no máximo 20 caracteres'),
  
  body('unit')
    .optional()
    .isLength({ max: 50 }).withMessage('Unidade deve ter no máximo 50 caracteres')
];

export const loginValidator = [
  body('email')
    .notEmpty().withMessage('Email é obrigatório')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Senha é obrigatória')
];
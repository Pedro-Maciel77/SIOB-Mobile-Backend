import { body } from 'express-validator';
import { OCCURRENCE_TYPES, OCCURRENCE_STATUS } from '../constants/occurrence.types';

export const createOccurrenceValidator = [
  body('type')
    .notEmpty().withMessage('Tipo da ocorrência é obrigatório')
    .isIn(OCCURRENCE_TYPES).withMessage(`Tipo inválido. Use: ${OCCURRENCE_TYPES.join(', ')}`),
  
  body('municipality')
    .notEmpty().withMessage('Município é obrigatório')
    .isLength({ min: 2, max: 100 }).withMessage('Município deve ter entre 2 e 100 caracteres'),
  
  body('neighborhood')
    .optional()
    .isLength({ max: 100 }).withMessage('Bairro deve ter no máximo 100 caracteres'),
  
  body('address')
    .notEmpty().withMessage('Endereço é obrigatório')
    .isLength({ min: 5, max: 500 }).withMessage('Endereço deve ter entre 5 e 500 caracteres'),
  
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude deve estar entre -90 e 90'),
  
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude deve estar entre -180 e 180'),
  
  body('occurrenceDate')
    .notEmpty().withMessage('Data da ocorrência é obrigatória')
    .isISO8601().withMessage('Data da ocorrência inválida'),
  
  body('activationDate')
    .notEmpty().withMessage('Data de acionamento é obrigatória')
    .isISO8601().withMessage('Data de acionamento inválida'),
  
  body('status')
    .optional()
    .isIn(OCCURRENCE_STATUS).withMessage(`Status inválido. Use: ${OCCURRENCE_STATUS.join(', ')}`),
  
  body('victimName')
    .optional()
    .isLength({ max: 100 }).withMessage('Nome da vítima deve ter no máximo 100 caracteres'),
  
  body('victimContact')
    .optional()
    .matches(/^(\+55)?\s?(\(?\d{2}\)?)?\s?9?\s?\d{4}-?\d{4}$/)
    .withMessage('Contato da vítima inválido'),
  
  body('vehicleNumber')
    .optional()
    .isLength({ max: 20 }).withMessage('Número da viatura deve ter no máximo 20 caracteres'),
  
  body('description')
    .notEmpty().withMessage('Descrição é obrigatória')
    .isLength({ min: 10, max: 5000 }).withMessage('Descrição deve ter entre 10 e 5000 caracteres')
];

export const updateOccurrenceValidator = [
  body('type')
    .optional()
    .isIn(OCCURRENCE_TYPES).withMessage(`Tipo inválido. Use: ${OCCURRENCE_TYPES.join(', ')}`),
  
  body('status')
    .optional()
    .isIn(OCCURRENCE_STATUS).withMessage(`Status inválido. Use: ${OCCURRENCE_STATUS.join(', ')}`),
  
  body('description')
    .optional()
    .isLength({ min: 10, max: 5000 }).withMessage('Descrição deve ter entre 10 e 5000 caracteres')
];

export const updateStatusValidator = [
  body('status')
    .notEmpty().withMessage('Status é obrigatório')
    .isIn(OCCURRENCE_STATUS).withMessage(`Status inválido. Use: ${OCCURRENCE_STATUS.join(', ')}`),
  
  body('reason')
    .optional()
    .isLength({ max: 500 }).withMessage('Motivo deve ter no máximo 500 caracteres')
];
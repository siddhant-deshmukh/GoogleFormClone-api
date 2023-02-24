import express, { NextFunction, Request, Response } from 'express'
import { body, check, validationResult } from 'express-validator';
import { createNewForm, editForm, editQuestion, getForm, getQuestion } from '../controllers/formController';
var router = express.Router();
import auth from '../middleware/auth'
import Form, { IForm, IFormStored } from '../models/form';
import Question, { IQuestion } from '../models/question';

/* GET home page. */
router.post('/',
  body('userId').exists().isString(),
  body('formId').exists().isString(),
  body('createdAt').exists().isDate(),

  body('questions').isArray().exists().isLength({ max: 20 }),
  body('questions.*._id').exists().isString(),
  body('questions.*.ans_type').exists().isIn(['short_ans', 'long_ans', 'mcq', 'checkbox', 'dropdown', 'mcq_grid', 'checkboc_grid', 'range', 'date', 'time']),
  body('questions.*.res_array').optional().isArray({ max: 50 }),
  body('questions.*.res_array.*').isString().trim().isLength({ min: 1, max: 50 }),
  body('questions.*.res_text').isString().trim().isLength({ min: 1, max: 400 }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },

  auth,
  createNewForm
);

router.put('/',
  body('userId').exists().isString(),
  body('formId').exists().isString(),
  body('createdAt').exists().isDate(),

  check('questions').isArray().exists().isLength({ max: 20 }),
  check('questions.*._id').exists().isString(),
  check('questions.*.ans_type').exists().isIn(['short_ans', 'long_ans', 'mcq', 'checkbox', 'dropdown', 'mcq_grid', 'checkboc_grid', 'range', 'date', 'time']),
  check('questions.*.res_array').optional().isArray({ max: 50 }),
  check('questions.*.res_array.*').optional().isString().trim().isLength({ min: 1, max: 50 }),
  check('questions.*.res_text').optional().isString().trim().isLength({ min: 1, max: 400 }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },

  auth,
  editForm
);

router.get('/',
  body('userId').exists().isString(),
  body('formId').exists().isString(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  auth,
  getForm
);

export default router
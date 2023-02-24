import express, { NextFunction, Request, Response } from 'express'
import { body, check, validationResult } from 'express-validator';
import { createNewForm, editForm, editQuestion, getForm, getQuestion } from '../controllers/formController';
import { newFormRes } from '../controllers/resController';
var router = express.Router();
import auth from '../middleware/auth'
import Form, { IForm, IFormStored } from '../models/form';
import Question, { IQuestion } from '../models/question';

/* GET home page. */
router.post('/',
  body('formId').exists().isString(),
    
  check('questions').isArray().exists().isLength({ max: 20, min:1 }),
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
  newFormRes
);

router.put('/',
  body('formId').exists().isString(),
  
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
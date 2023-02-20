import express, { NextFunction, Request, Response } from 'express' 
import { body, check, validationResult } from 'express-validator';
import { createNewForm, editForm, editQuestion, getForm, getQuestion } from '../controllers/formController';
var router = express.Router();
import auth from '../middleware/auth'
import Form, { IForm, IFormStored } from '../models/form';
import Question, { IQuestion } from '../models/question';

/* GET home page. */
router.post('/',
  body('title').isString().isLength({max:100,min:3}),
  body('desc').optional().isString().isLength({max:150}),
  body('starttime').optional().isDate(),
  body('endtime').optional().isDate(),
  body('questions').optional().isArray({max:20}),

  check('questions.*.required').isBoolean().exists(),
  check('questions.*.title').isString().isLength({min:3,max:150}),
  check('questions.*.desc').isString().optional().isLength({max:150}),
  check('questions.*.ans_type').exists().isIn(['short_ans', 'long_ans', 'mcq', 'checkbox', 'dropdown', 'mcq_grid', 'checkboc_grid', 'range', 'date', 'time']),
  check('questions.*.optionsArray').optional().isArray({max:20}),
  check('questions.*.optionsArray.*.option').optional().isString().isLength({min:3,max:50}),
  check('questions.*.correct_ans').optional().isArray({max:20}),
  check('questions.*.correct_ans.*.ans').optional().isString().isLength({min:3,max:50}),
  check('questions.*.point').optional().isInt({max:100,min:0}),

  auth,
  (req: Request, res: Response, next: NextFunction)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
    }
    next()
  },
  createNewForm
);

router.put('/:formId',
  body('title').optional().isString().isLength({max:100,min:3}),
  body('desc').optional().isString().isLength({max:150}),
  body('starttime').optional().isDate(),
  body('endtime').optional().isDate(),
  
  body('questions').exists().isArray({max:20}),
  body('new_questions').exists().isArray({max:20}),
  body('delete_questions').exists().isArray({max:20}),
  
  check('new_questions.*.required').isBoolean().exists(),
  check('new_questions.*.title').isString().isLength({min:3,max:150}),
  check('new_questions.*.desc').isString().optional().isLength({max:150}),
  check('new_questions.*.ans_type').exists().isIn(['short_ans', 'long_ans', 'mcq', 'checkbox', 'dropdown', 'mcq_grid', 'checkboc_grid', 'range', 'date', 'time']),
  check('new_questions.*.optionsArray').optional().isArray({max:20}),
  check('new_questions.*.optionsArray.*.option').optional().isString().isLength({min:3,max:50}),
  check('new_questions.*.correct_ans').optional().isArray({max:20}),
  check('new_questions.*.correct_ans.*.ans').optional().isString().isLength({min:3,max:50}),
  check('new_questions.*.point').optional().isInt({max:100,min:0}),

  auth,
  (req: Request, res: Response, next: NextFunction)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
    }
    next()
  },
  editForm
);
router.get('/:formId',
  auth,
  getForm
);

router.get('/:formId/q/:queId',
  auth,
  getQuestion
);
router.put('/:formId/q/:queId',
  body('required').isBoolean().exists(),
  body('title').isString().isLength({min:3,max:150}),
  body('desc').isString().optional().isLength({max:150}),
  body('ans_type').exists().isIn(['short_ans', 'long_ans', 'mcq', 'checkbox', 'dropdown', 'mcq_grid', 'checkboc_grid', 'range', 'date', 'time']),
  body('optionsArray').optional().isArray({max:20}),
  body('optionsArray.*.option').optional().isString().isLength({min:3,max:50}),
  body('correct_ans').optional().isArray({max:20}),
  body('correct_ans.*.ans').optional().isString().isLength({min:3,max:50}),
  body('point').optional().isInt({max:100,min:0}),
  auth,
  (req: Request, res: Response, next: NextFunction)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
    }
    next()
  },
  editQuestion
);
export default router
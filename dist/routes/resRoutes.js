"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const formController_1 = require("../controllers/formController");
const resController_1 = require("../controllers/resController");
var router = express_1.default.Router();
const auth_1 = __importDefault(require("../middleware/auth"));
/* GET home page. */
router.post('/', (0, express_validator_1.body)('formId').exists().isString(), (0, express_validator_1.check)('questions').isArray().exists().isLength({ max: 20, min: 1 }), (0, express_validator_1.check)('questions.*._id').exists().isString(), (0, express_validator_1.check)('questions.*.ans_type').exists().isIn(['short_ans', 'long_ans', 'mcq', 'checkbox', 'dropdown', 'mcq_grid', 'checkboc_grid', 'range', 'date', 'time']), (0, express_validator_1.check)('questions.*.res_array').optional().isArray({ max: 50 }), (0, express_validator_1.check)('questions.*.res_array.*').optional().isString().trim().isLength({ min: 1, max: 50 }), (0, express_validator_1.check)('questions.*.res_text').optional().isString().trim().isLength({ min: 1, max: 400 }), (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, auth_1.default, resController_1.newFormRes);
router.put('/', (0, express_validator_1.body)('formId').exists().isString(), (0, express_validator_1.check)('questions').isArray().exists().isLength({ max: 20 }), (0, express_validator_1.check)('questions.*._id').exists().isString(), (0, express_validator_1.check)('questions.*.ans_type').exists().isIn(['short_ans', 'long_ans', 'mcq', 'checkbox', 'dropdown', 'mcq_grid', 'checkboc_grid', 'range', 'date', 'time']), (0, express_validator_1.check)('questions.*.res_array').optional().isArray({ max: 50 }), (0, express_validator_1.check)('questions.*.res_array.*').optional().isString().trim().isLength({ min: 1, max: 50 }), (0, express_validator_1.check)('questions.*.res_text').optional().isString().trim().isLength({ min: 1, max: 400 }), (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, auth_1.default, formController_1.editForm);
router.get('/', (0, express_validator_1.body)('userId').exists().isString(), (0, express_validator_1.body)('formId').exists().isString(), (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, auth_1.default, formController_1.getForm);
exports.default = router;

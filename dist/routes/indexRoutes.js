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
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const express_validator_1 = require("express-validator");
const users_1 = __importDefault(require("../models/users"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth"));
/* GET home page. */
router.get('/', function (req, res, next) {
    res.send({ title: 'This is for GoogleForm' });
});
router.post('/', auth_1.default, function (req, res, next) {
    res.send({ title: 'This is for GoogleForm' });
});
router.post('/register', (0, express_validator_1.body)('email').isEmail().isLength({ max: 50, min: 3 }).toLowerCase().trim(), (0, express_validator_1.body)('name').isString().isLength({ max: 50, min: 3 }).trim(), (0, express_validator_1.body)('password').isString().isLength({ max: 30, min: 5 }).trim(), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, name, password } = req.body;
        const checkEmail = yield users_1.default.findOne({ email });
        if (checkEmail)
            return res.status(409).json({ msg: 'User already exists!' });
        const encryptedPassword = yield bcryptjs_1.default.hash(password, 15);
        const newUser = yield users_1.default.create({
            email,
            name,
            password: encryptedPassword,
        });
        const token = jsonwebtoken_1.default.sign({ _id: newUser._id.toString(), email }, process.env.TOKEN_KEY || 'zhingalala', { expiresIn: '2h' });
        res.cookie("GoogleFormClone_acesstoken", token);
        return res.status(201).json({ token });
    });
});
router.post('/login-password', (0, express_validator_1.body)('email').isEmail().isLength({ max: 50, min: 3 }), (0, express_validator_1.body)('password').isString().isLength({ max: 30, min: 5 }), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        const checkUser = yield users_1.default.findOne({ email });
        if (!checkUser)
            return res.status(404).json({ msg: 'User doesn`t exists!' });
        const token = jsonwebtoken_1.default.sign({ _id: checkUser._id.toString(), email }, process.env.TOKEN_KEY || 'zhingalala', { expiresIn: '2h' });
        res.cookie("GoogleFormClone_acesstoken", token);
        return res.status(201).json({ token });
    });
});
router.post('/login-google', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
router.post('/login-github', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
exports.default = router;

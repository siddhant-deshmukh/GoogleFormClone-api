import express, { NextFunction, Request, Response } from 'express' 
var router = express.Router();
import {  body,  validationResult } from 'express-validator';
import User, { IUserStored } from '../models/users';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import auth from '../middleware/auth'

/* GET home page. */
router.get('/', function(req : Request, res : Response, next : NextFunction) {
  res.send({ title: 'This is for GoogleForm' });
});
router.post('/', auth, function(req : Request, res : Response, next : NextFunction) {
  res.send({ title: 'This is for GoogleForm' });
});

router.post('/register', 
  body('email').isEmail().isLength({max:50,min:3}).toLowerCase().trim(),
  body('name').isString().isLength({max:50,min:3}).trim(),
  body('password').isString().isLength({max:30,min:5}).trim(), 
  async function(req : Request, res : Response, next : NextFunction) {
    try{
      const {email,name,password} : {email:string,name:string,password:string}  = req.body;
      const checkEmail = await User.findOne({email});
      if(checkEmail) return res.status(409).json({msg:'User already exists!'});

      const encryptedPassword = await bcrypt.hash(password,15)

      const newUser : IUserStored = await User.create({
        email,
        name,
        password : encryptedPassword,
      })
      
      const token = jwt.sign({_id:newUser._id.toString(),email},process.env.TOKEN_KEY || 'zhingalala',{expiresIn:'2h'})
      res.cookie("GoogleFormClone_acesstoken",token)
      return res.status(201).json({token})
    } catch (err) {
      return res.status(500).json({msg : 'Some internal error occured',err})
    }
  }
);
router.post('/login-password',
  body('email').isEmail().isLength({max:50,min:3}),
  body('password').isString().isLength({max:30,min:5}), 
  async function(req : Request, res : Response, next : NextFunction) {
    const {email,password} : {email:string,password:string}  = req.body;
    const checkUser = await User.findOne({email});
    
    if(!checkUser) return res.status(404).json({msg:'User doesn`t exists!'});
    if(!checkUser.password) return res.status(405).json({msg:'Try another method'});
    if(!(await bcrypt.compare(password, checkUser.password))) return res.status(406).json({msg:'Wrong password!'}) ;

    const token = jwt.sign({_id:checkUser._id.toString(),email},process.env.TOKEN_KEY || 'zhingalala',{expiresIn:'2h'})
    res.cookie("GoogleFormClone_acesstoken",token)
    return res.status(201).json({token})
  }
);
router.post('/login-google', 
  function(req : Request, res : Response, next : NextFunction) {
    res.render('index', { title: 'Express' });
  }
);
router.post('/login-github', 
  function(req : Request, res : Response, next : NextFunction) {
    res.render('index', { title: 'Express' });
  }
);
export default router
import express, { NextFunction, Request, Response } from 'express'
import Form, { IForm, IFormStored } from '../models/form';
import Question, { IQuestion, IQuestionStored } from '../models/question';
import User from '../models/users';
import { IMongooseObjectId } from '../types';

export async function createNewForm(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, desc, starttime, endtime, questions }: IForm = req.body
    const { _id, forms } = res.user
    const form: IFormStored = {
      title, desc, starttime, endtime, author: _id, questions: []
    }
    if (forms.length > 9) return res.status(403).json({ msg: 'Can not make more than 10 forms' })
    const formCreated = await Form.create(form);
    
    await User.findByIdAndUpdate(_id, {
      forms: [formCreated._id , ...forms]
    })

    const PromiseArray = questions.map(async (que) => {
      try {

        let newQue = await Question.create({ ...que, formId: formCreated._id })
        return newQue._id
      } catch {
        return null
      }
    })
    const quesIds = await Promise.all(PromiseArray)
    quesIds.filter(ele => (ele))

    await Form.findByIdAndUpdate(formCreated._id, {
      questions: quesIds
    })

    return res.status(201).json({ formId : formCreated._id})
  } catch (err) {
    return res.status(500).json({ msg: 'Some internal error occured', err })
  }
}

export async function getForm(req: Request, res: Response, next: NextFunction) {
  try{
    const { formId } = req.params
    const { withQuestions } = req.query
    const { _id, forms } = res.user
    const oldForm : IFormStored | null = await Form.findById(formId)
    if (!oldForm) return res.status(404).json({ msg: 'form not found' })

    let queListPromises = oldForm.questions.map(async (queId)=>{
      try{
        if(oldForm.author === _id) return (await Question.findById(queId)) as IQuestionStored | null
        else return (await Question.findById(queId).select({correct_ans:0})) as IQuestionStored | null
      } catch {
        return null;
      } 
    })
    // console.log(withQuestions)
    if(withQuestions==="true"){
      let queList = await Promise.all(queListPromises)
      queList = queList.filter(ele => (!(ele === null)))
      const questions : {[key : string]: IQuestionStored} = {}
      queList.forEach(que=>{
        questions[que?._id.toString() as string] = que as IQuestionStored
      })
      
      return res.status(201).json({form:oldForm,questions})
    }else{
      return res.status(201).json({form:oldForm})
    }
  } catch (err) {
    return res.status(500).json({ msg: 'Some internal error occured', err })
  }


}
export async function editForm(req: Request, res: Response, next: NextFunction) {
  try {
    const { _id } = res.user

    const { formId } = req.params
    const oldForm = await Form.findById(formId)
    if (!oldForm) return res.status(404).json({ msg: 'form not found' })
    if (oldForm.author.toString() !== _id.toString()) return res.status(401).json({ msg: 'Unauthorized' })

    let newForm = {  }

    const { title, desc, starttime, endtime }: IForm = req.body
    if (title) newForm = { ...newForm, title }
    if (desc) newForm = { ...newForm, desc }
    if (starttime && endtime) newForm = { ...newForm, title, starttime, endtime }

    const { questions,  new_questions }: { questions: (string | null | number)[],  new_questions: IQuestionStored[] } = req.body;

    let count = 0;
    questions.forEach((element, index) => {
      if (element === null && count < new_questions.length) {
        questions[index] = count;
        count += 1;
      }
    });

    console.log(" Questions : ",questions)
    console.log(" new questions" , new_questions)

    const PromiseArray = questions.map(async (que) => {
      try {
        console.log("Type que",typeof que)
        if (typeof que === 'string') return que
        else if (typeof que === 'number') {
          let que_ = new_questions[que] 
          console.log(que_)
          let newQue = await Question.create({ ...que_, formId })
          return newQue._id
        } else return null
      } catch {
        return null
      }
    })
    let  quesIds = await Promise.all(PromiseArray)
    quesIds = quesIds.filter(ele => (!(ele === null)))

    console.log(quesIds)
    console.log( "Old Form", oldForm.questions)

    const deleteQueList: (string | IMongooseObjectId)[] = []
    oldForm.questions.forEach((oldQueId) => {
      if (!(quesIds.includes(oldQueId.toString()))) {
        // console.log(oldQueId.toString() in quesIds,oldQueId.toString(),quesIds)
        deleteQueList.push(oldQueId)
      }
    })

    console.log("Delete Que list",deleteQueList)
    const delPromiseArray = deleteQueList.map(async (que) => {
      try {
        const a = await Question.findByIdAndDelete(que)
      } catch {
        return null
      }
    })
    Promise.all(delPromiseArray)

    console.log(formId , {
      ...newForm,
      questions: quesIds
    })
    await Form.findByIdAndUpdate(formId, {
      ...newForm,
      questions: quesIds
    })

    return res.status(201).json({
      ...newForm,
      questions: quesIds
    })
  } catch (err) {
    return res.status(500).json({ msg: 'Some internal error occured', err })
  }
}
export async function getQuestion(req: Request, res: Response, next: NextFunction) {
  // try {
    const { _id, forms } = res.user

    const { formId, queId } = req.params

    const oldForm = await Form.findById(formId)
    if (!oldForm) return res.status(404).json({ msg: 'form not found' })
    let que : IQuestion | null;
    if (oldForm.author.toString() !== _id.toString()){
      que = await Question.findById(queId).select({correct_ans:0})
    }else{
      que = await Question.findById(queId)
    }

    if(!que) return res.status(404).json({ msg: 'question not found' })
    if(que.formId.toString() !== formId) return res.status(401).json({ msg: 'Unauthorized' })
    

    return res.status(201).json(que)
  // } catch (err) {
  //   return res.status(500).json({ msg: 'Some internal error occured', err })
  // }
}
export async function editQuestion(req: Request, res: Response, next: NextFunction) {
  // try {
    const { _id, forms } = res.user

    const { formId, queId } = req.params

    const oldForm = await Form.findById(formId)
    if (!oldForm) return res.status(404).json({ msg: 'form not found' })
    const que = await Question.findById(queId);
    if (oldForm.author.toString() !== _id.toString()) return res.status(401).json({ msg: 'Unauthorized' });
    
    if(!que) return res.status(404).json({ msg: 'question not found' })
    if(que.formId.toString() !== formId) return res.status(401).json({ msg: 'Unauthorized' })
    
    const  {title, desc, ans_type, required, optionsArray, correct_ans, point } : IQuestionStored  = req.body 
    await Question.findByIdAndUpdate(queId,{title, desc, ans_type, required, optionsArray, correct_ans, point }) 

    return res.status(201).json({title, desc, ans_type, required, optionsArray, correct_ans, point })
  // } catch (err) {
  //   return res.status(500).json({ msg: 'Some internal error occured', err })
  // }
}
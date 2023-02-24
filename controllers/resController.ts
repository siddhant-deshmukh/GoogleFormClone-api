import express, { NextFunction, Request, Response } from 'express'
import mongoose, { ClientSession } from 'mongoose';
import Form, { IForm, IFormStored } from '../models/form';
import Question, { IQuestion, IQuestionStored } from '../models/question';
import { IResSummery_b } from '../models/resSummery';
import ResSummery from '../models/resSummery';
import User from '../models/users';



export async function newFormRes(req: Request, res: Response) {
  try {
    const { formId } = req.body
    const { _id, forms } = res.user

    const oldForm = await Form.findById(formId)
    if (!oldForm) return res.status(404).json({ msg: 'form not found' })

    const { questions }: {
      questions: ({
        _id: string,
        res_array: string[],
        res_text: string,
        ans_type: 'short_ans' | 'long_ans' | 'mcq' | 'checkbox' | 'dropdown' | 'mcq_grid' | 'checkboc_grid' | 'range' | 'date' | 'time'
      })[]
    } = req.body


    const question_res_PromiseArray = questions.map( async ({ _id: qId, ans_type, res_array, res_text })
      : Promise<null | { questionId: string, res_text: string } | { questionId: string, res_array: string[] }> => {

      const oldQue = await Question.findById(qId)
      if (!oldQue || oldQue.ans_type !== ans_type) return null;
      if (oldQue.ans_type === 'short_ans' || oldQue.ans_type === 'long_ans') {
        if (res_text) {
          return { questionId: qId, res_text } as { questionId: string, res_text: string }
        } else return null
      }
      if (oldQue.ans_type === 'checkbox' || oldQue.ans_type === 'dropdown' || oldQue.ans_type === 'mcq') {
        if (res_array && res_array.every(r => oldQue.optionsArray?.includes(r))) {
          return { questionId: qId, res_array } as { questionId: string, res_array: string[] }
        } else return null
      }
      return null
    });
    const question_res = await Promise.all(question_res_PromiseArray)
    
    const isNull = question_res.findIndex((ele)=>ele===null)
    if(isNull===-1){
      return res.status(401).json({ msg: 'Improper format of questions' })
    }

    const formResSummery = await ResSummery.findById(oldForm.formResSummery)
    // const session: ClientSession = await mongoose.startSession();
    // session.startTransaction();
    // try {
    //   const formCreated = await Form.create(form);
    //   await User.findByIdAndUpdate(_id, {
    //     forms: [formCreated._id, ...forms]
    //   })

    //   const newQue = await Question.create({ ...defaultQuestion, formId: formCreated._id })
    //   await Form.findByIdAndUpdate(formCreated._id, {
    //     questions: newQue._id
    //   })
    //   await ResSummery.create({
    //     formId: formCreated._id,
    //     userId: _id,
    //   })

    //   await session.commitTransaction();
    //   session.endSession();
    //   return res.status(201).json({ formId: formCreated._id })
    // } catch (error) {
    //   await session.abortTransaction();
    //   session.endSession();
    //   throw error;
    // }
  } catch (err) {
    return res.status(500).json({ msg: 'Some internal error occured', err })
  }
}
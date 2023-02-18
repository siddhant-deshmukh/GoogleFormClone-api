import mongoose, { Date } from "mongoose";
import { IMongooseObjectId } from "../types";

export interface IQuestion {
    required: boolean,
    title: string,
    desc?: string,
    ans_type: 'short_ans' | 'long_ans' | 'mcq' | 'checkbox' | 'dropdown' | 'mcq_grid' | 'checkboc_grid' | 'range' | 'date' | 'time',
    optionsArray?: string[],
    point?:number 
}
export interface IQuestionStored extends IQuestion {
    correct_ans?: string[]
}
const questionSchema = new mongoose.Schema<IQuestionStored>({
    required: { type: Boolean, required: true, default: true },
    title: { type: String, required: true, maxLength: 150 },
    desc: { type: String, maxLength: 150 },
    ans_type: { type: String, required: true, enum: ['short_ans', 'long_ans', 'mcq', 'checkbox', 'dropdown', 'mcq_grid', 'checkboc_grid', 'range', 'date', 'time'] },
    optionsArray: [{ type: String, maxlength: 50 }],
    correct_ans:[{type:String,maxlength:50}],
    point:{type:Number,min:0,max:100}
})
questionSchema.path('optionsArray').validate((val: IMongooseObjectId[]) => { return val.length < 100 }, 'question can have 100 options at max')

export default mongoose.model<IQuestion>("Form", questionSchema)
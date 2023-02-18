import mongoose, { Date } from "mongoose";
import { IMongooseObjectId } from "../types";

export interface IQueRes {
    queId: IMongooseObjectId,
    que_type: 'short_ans' | 'long_ans' | 'mcq' | 'checkbox' | 'dropdown' | 'mcq_grid' | 'checkboc_grid' | 'range' | 'date' | 'time',
    ansArray: string[],
    ans: string
}

export interface IFormRes {
    author: IMongooseObjectId,
    paper: IMongooseObjectId,
    lastSubmit: Date,
    queRes: IQueRes[]
}

const queResSchema = new mongoose.Schema<IQueRes>({
    queId: {type: mongoose.SchemaTypes.ObjectId, required: true},
    que_type: { type: String, required: true, enum: ['short_ans', 'long_ans', 'mcq', 'checkbox', 'dropdown', 'mcq_grid', 'checkboc_grid', 'range', 'date', 'time'] },
    ansArray: [{ type: String, maxlength: 50 }],
    ans: {type:String,maxlength:150}
})
queResSchema.path('ansArray')
    .validate((val: IMongooseObjectId[]) => { 
        return (val.length < 100 )
    }, 'question can have 100 options at max');

const formSchema = new mongoose.Schema<IFormRes>({
    author: { type: mongoose.SchemaTypes.ObjectId, required: true, ref:"User" },
    paper :  { type: mongoose.SchemaTypes.ObjectId, required: true, ref:'Form' },
    queRes: [queResSchema],
    lastSubmit: { type: Date, required:true },
})
formSchema.path('queRes').validate((val: IMongooseObjectId[]) => { return val.length < 20 }, 'form response can have 20 questions at max')

export default mongoose.model<IFormRes>("Form", formSchema)
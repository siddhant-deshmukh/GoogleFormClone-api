import mongoose from "mongoose";
import { IMongooseObjectId } from "../types";


export interface IUserSnippet {
    name : string,
    bio? : string,
}
export interface IUser extends IUserSnippet{
    forms : IMongooseObjectId[],
}
export interface IUserStored extends IUser{
    _id : IMongooseObjectId,
    email : string,
    password? : string,
    auth_type : string[],
} 

const userSchema = new mongoose.Schema<IUserStored>({
    name: {type:String,required:true,maxLength:50,minlength:3},
    email : {type:String,unique:true,maxLength:50,minlength:3},
    bio : {type:String,maxLength:150},
    password : {type:String,maxLength:100,minlength:5},
    auth_type : [{type:String,required:true,enum:['google','github','password']}],
    forms : [{type:mongoose.SchemaTypes.ObjectId,ref:'Forms'}],
})
userSchema.path('forms').validate((val:IMongooseObjectId[])=>{return val.length < 10},'user can have 10 forms at max')
userSchema.path('auth_type').validate((val:string[])=>{return val.length < 3},'user can have 3 authtype at max')

const User = mongoose.model<IUserStored>("User",userSchema);
export default User;
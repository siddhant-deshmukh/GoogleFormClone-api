"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const questionSchema = new mongoose_1.default.Schema({
    required: { type: Boolean, required: true, default: true },
    title: { type: String, required: true, maxLength: 150 },
    desc: { type: String, maxLength: 150 },
    ans_type: { type: String, required: true, enum: ['short_ans', 'long_ans', 'mcq', 'checkbox', 'dropdown', 'mcq_grid', 'checkboc_grid', 'range', 'date', 'time'] },
    optionsArray: [{ type: String, maxlength: 50 }]
});
questionSchema.path('optionsArray').validate((val) => { return val.length < 100; }, 'question can have 100 options at max');
const formSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, maxLength: 100 },
    desc: { type: String, maxLength: 150 },
    author: { type: mongoose_1.default.SchemaTypes.ObjectId, required: true },
    questions: [questionSchema],
    starttime: { type: Date },
    endtime: { type: Date },
});
formSchema.path('questions').validate((val) => { return val.length < 20; }, 'form can have 20 questions at max');
exports.default = mongoose_1.default.model("Form", formSchema);

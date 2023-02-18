"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const queResSchema = new mongoose_1.default.Schema({
    queId: { type: mongoose_1.default.SchemaTypes.ObjectId, required: true },
    que_type: { type: String, required: true, enum: ['short_ans', 'long_ans', 'mcq', 'checkbox', 'dropdown', 'mcq_grid', 'checkboc_grid', 'range', 'date', 'time'] },
    ansArray: [{ type: String, maxlength: 50 }],
    ans: { type: String, maxlength: 150 }
});
queResSchema.path('ansArray')
    .validate((val) => {
    return (val.length < 100);
}, 'question can have 100 options at max');
const formSchema = new mongoose_1.default.Schema({
    author: { type: mongoose_1.default.SchemaTypes.ObjectId, required: true, ref: "User" },
    paper: { type: mongoose_1.default.SchemaTypes.ObjectId, required: true, ref: 'Form' },
    queRes: [queResSchema],
    lastSubmit: { type: Date, required: true },
});
formSchema.path('queRes').validate((val) => { return val.length < 20; }, 'form response can have 20 questions at max');
exports.default = mongoose_1.default.model("Form", formSchema);

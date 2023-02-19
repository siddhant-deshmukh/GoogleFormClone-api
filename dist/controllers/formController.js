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
exports.editQuestion = exports.getQuestion = exports.editForm = exports.getForm = exports.createNewForm = void 0;
const form_1 = __importDefault(require("../models/form"));
const question_1 = __importDefault(require("../models/question"));
const users_1 = __importDefault(require("../models/users"));
function createNewForm(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title, desc, starttime, endtime, questions } = req.body;
            const { _id, forms } = res.user;
            const form = {
                title, desc, starttime, endtime, author: _id, questions: []
            };
            if (forms.length > 9)
                return res.status(403).json({ msg: 'Can not make more than 10 forms' });
            const formCreated = yield form_1.default.create(form);
            const updatedUser = yield users_1.default.findByIdAndUpdate(_id, {
                forms: [...forms, formCreated._id]
            });
            const PromiseArray = questions.map((que) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let newQue = yield question_1.default.create(Object.assign(Object.assign({}, que), { formId: formCreated._id }));
                    return newQue._id;
                }
                catch (_a) {
                    return null;
                }
            }));
            const quesIds = yield Promise.all(PromiseArray);
            quesIds.filter(ele => (ele));
            const updatedForm = yield form_1.default.findByIdAndUpdate(formCreated._id, {
                questions: quesIds
            });
            return res.status(201).json({ form: { updatedForm, questions: quesIds }, updatedUser });
        }
        catch (err) {
            return res.status(500).json({ msg: 'Some internal error occured', err });
        }
    });
}
exports.createNewForm = createNewForm;
function getForm(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { formId } = req.params;
        const { _id, forms } = res.user;
        const oldForm = yield form_1.default.findById(formId);
        if (!oldForm)
            return res.status(404).json({ msg: 'form not found' });
        let queListPromises = oldForm.questions.map((queId) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (oldForm.author === _id)
                    return (yield question_1.default.findById(queId));
                else
                    return (yield question_1.default.findById(queId).select({ correct_ans: 0 }));
            }
            catch (_a) {
                return null;
            }
        }));
        let queList = yield Promise.all(queListPromises);
        queList = queList.filter(ele => (!(ele === null)));
        return res.status(201).json({ oldForm, questions: queList });
    });
}
exports.getForm = getForm;
function editForm(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // try {
        const { _id } = res.user;
        const { formId } = req.params;
        const oldForm = yield form_1.default.findById(formId);
        if (!oldForm)
            return res.status(404).json({ msg: 'form not found' });
        if (oldForm.author.toString() !== _id.toString())
            return res.status(401).json({ msg: 'Unauthorized' });
        let newForm = {};
        const { title, desc, starttime, endtime } = req.body;
        if (title)
            newForm = Object.assign(Object.assign({}, newForm), { title });
        if (desc)
            newForm = Object.assign(Object.assign({}, newForm), { desc });
        if (starttime && endtime)
            newForm = Object.assign(Object.assign({}, newForm), { title, starttime, endtime });
        const { questions, delete_questions, new_questions } = req.body;
        let count = 0;
        questions.forEach((element, index) => {
            if (element === null && count < new_questions.length) {
                questions[index] = count;
                count += 1;
            }
        });
        // console.log(" Questions : ",questions)
        const PromiseArray = questions.map((que) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof que === 'string')
                    return que;
                else if (typeof que === 'number') {
                    let que_ = new_questions[que];
                    let newQue = yield question_1.default.create(Object.assign(Object.assign({}, que_), { formId }));
                    return newQue._id;
                }
                else
                    return null;
            }
            catch (_a) {
                return null;
            }
        }));
        let quesIds = yield Promise.all(PromiseArray);
        quesIds = quesIds.filter(ele => (!(ele === null)));
        // console.log(quesIds)
        // console.log( "Old Form", oldForm.questions)
        const deleteQueList = [];
        oldForm.questions.forEach((oldQueId) => {
            if (!(quesIds.includes(oldQueId.toString()))) {
                // console.log(oldQueId.toString() in quesIds,oldQueId.toString(),quesIds)
                deleteQueList.push(oldQueId);
            }
        });
        // console.log("Delete Que list",deleteQueList)
        const delPromiseArray = deleteQueList.map((que) => __awaiter(this, void 0, void 0, function* () {
            try {
                const a = yield question_1.default.findByIdAndDelete(que);
            }
            catch (_b) {
                return null;
            }
        }));
        Promise.all(delPromiseArray);
        // console.log(formId , {
        //   ...newForm,
        //   questions: quesIds
        // })
        yield form_1.default.findByIdAndUpdate(formId, Object.assign(Object.assign({}, newForm), { questions: quesIds }));
        return res.status(201).json(Object.assign(Object.assign({}, newForm), { questions: quesIds }));
        // } catch (err) {
        //   return res.status(500).json({ msg: 'Some internal error occured', err })
        // }
    });
}
exports.editForm = editForm;
function getQuestion(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // try {
        const { _id, forms } = res.user;
        const { formId, queId } = req.params;
        const oldForm = yield form_1.default.findById(formId);
        if (!oldForm)
            return res.status(404).json({ msg: 'form not found' });
        let que;
        if (oldForm.author.toString() !== _id.toString()) {
            que = yield question_1.default.findById(queId).select({ correct_ans: 0 });
        }
        else {
            que = yield question_1.default.findById(queId);
        }
        if (!que)
            return res.status(404).json({ msg: 'question not found' });
        if (que.formId.toString() !== formId)
            return res.status(401).json({ msg: 'Unauthorized' });
        return res.status(201).json(que);
        // } catch (err) {
        //   return res.status(500).json({ msg: 'Some internal error occured', err })
        // }
    });
}
exports.getQuestion = getQuestion;
function editQuestion(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // try {
        const { _id, forms } = res.user;
        const { formId, queId } = req.params;
        const oldForm = yield form_1.default.findById(formId);
        if (!oldForm)
            return res.status(404).json({ msg: 'form not found' });
        const que = yield question_1.default.findById(queId);
        if (oldForm.author.toString() !== _id.toString())
            return res.status(401).json({ msg: 'Unauthorized' });
        if (!que)
            return res.status(404).json({ msg: 'question not found' });
        if (que.formId.toString() !== formId)
            return res.status(401).json({ msg: 'Unauthorized' });
        const { title, desc, ans_type, required, optionsArray, correct_ans, point } = req.body;
        yield question_1.default.findByIdAndUpdate(queId, { title, desc, ans_type, required, optionsArray, correct_ans, point });
        return res.status(201).json({ title, desc, ans_type, required, optionsArray, correct_ans, point });
        // } catch (err) {
        //   return res.status(500).json({ msg: 'Some internal error occured', err })
        // }
    });
}
exports.editQuestion = editQuestion;

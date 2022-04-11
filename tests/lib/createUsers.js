"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsers = void 0;
const axios_1 = __importDefault(require("axios"));
const base = 'http://localhost:5001/sunnus-22/us-central1';
const fn = 'createUsers';
function createUsers() {
    console.log('function: createUsers');
    axios_1.default
        .post(`${base}/${fn}`, {
        data: {
            something: 'is up',
        },
    })
        .then((res) => console.log(res.data));
}
exports.createUsers = createUsers;

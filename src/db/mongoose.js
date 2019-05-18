const mongoose = require(`mongoose`); //MONGOOSE USES MONGODB
// const validator = require(`validator`); //NPM TOOL

//CONNECT
mongoose.connect(/*`mongodb://127.0.0.1:27017/task-manager-api`*/process.env.MONGODB_URL, { //MOVED TO .ENV
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

//DEFINE MODEL
// const User = mongoose.model(`User`, {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if (value < 0){
//                 throw new Error(`age must be a positive number`);
//             }
//         }
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value) {
//             if (!validator.isEmail(value)) { //VALIDATOR
//                 throw new Error(`email is invalid`);
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 7,
//         validate(value) {
//             if (validator.contains(value.toLowerCase(), `password`)) {
//                 throw new Error(`password can't contain the word 'password'`)
//             }
//         }
//     }
// })

// const test = new User({
//     name: `Jeanne`,
//     email: `jeannedarc@gmail.com`,
//     password: `passworD`
// })

// const me = new User({
//     name: `Cara`,
//     age: 27
// })

// test.save().then(() => {
//     console.log(test);
// }).catch((error) => {
//     console.log(`Error.`, error);
// })

// const Task = mongoose.model(`Task`, {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         required: false,
//         default: false
//     }
// })

// const study = new Task({
//     description: `get a house        `,
// })

// study.save().then(() => {
//     console.log(study);
// }).catch((error) => {
//     console.log(`Error`, error);
// })
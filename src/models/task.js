const mongoose = require(`mongoose`);

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    },
    owner: { //MAKE TASK SPECIFIC TO OWNER
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: `User` //USE POPULATE TO GRAB WHOLE OBJECT
    }
}, {
    timestamps: true
})

const Task = mongoose.model(`Task`, taskSchema);

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
//     },
//     owner: { //MAKE TASK SPECIFIC TO OWNER
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: `User` //USE POPULATE TO GRAB WHOLE OBJECT
//     }
// })

module.exports = Task;
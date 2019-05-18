const mongoose = require(`mongoose`);
const validator = require(`validator`);
const bcrypt = require(`bcryptjs`);
const jwt = require(`jsonwebtoken`);
const Task = require(`./task`);

const userSchema = new mongoose.Schema({ //USING MIDDLEWARE FROM MONGOOSE
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0){
                throw new Error(`age must be a positive number`);
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) { //VALIDATOR
                throw new Error(`email is invalid`);
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (validator.contains(value.toLowerCase(), `password`)) {
                throw new Error(`password can't contain the word 'password'`)
            }
        }
    },
    tokens: [{ //GOOD FOR LOGGING FROM MULTIPLE DEVICES
        token: {
            type: String,
            required: true
        }
    }],
    avatar: { //STORE DATA AS BINARY
        type: Buffer
    }
}, {
    timestamps: true
});

//VIRTUAL TYPE RELATIONSHIP
userSchema.virtual(`tasks`, {
    ref: `Task`,
    foreignField: `owner`, //CREATE RELATIONSHIP WITH TASK
    localField: `_id` //CREATE RELATIONSHIP WITH TASK AND ID
});

//SETUP PUBLIC PROFILE
// userSchema.methods.getPublicProfile = function () {
userSchema.methods.toJSON = function () { //SHORTHAND FOR ABOVE - SEE USER.JS
    const user = this;
    const userObject = user.toObject(); //GET RAW OBJECT PROVIDED BY MONGOOSE
    //DELETE CERTAIN ASPECTS OF OBJECT
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}

//METHODS ARE ACCESSIBLE IN SPECIFIC INSTANCE
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, /*`thisismynewcourse`*/process.env.JWT_TOKEN); //MOVED TO .ENV
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

//SIGNING IN
//CREATE METHOD FOR MODEL
userSchema.statics.findByCredentials = async (email, password) => { //STATICS ARE ACCESSIBLE IN THE GENERAL MODEL
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error(`unable to login`);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error(`unable to login`);
    }

    return user;
}

//MIDDLEWARE HASH PASSWORDS BEFORE SAVE
userSchema.pre(`save`, async function (next) { //CANNOT BE AN ARROW FUNCTION
    const user = this;
    // console.log(`just before saving`);
    if (user.isModified(`password`)) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next(); //REQUIRED TO MOVE ON
})

//MIDDLEWARE DELETE USER TASKS WHEN REMOVE
userSchema.pre(`remove`, async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
})

const User = mongoose.model(`User`, userSchema /*{
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0){
                throw new Error(`age must be a positive number`);
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) { //VALIDATOR
                throw new Error(`email is invalid`);
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (validator.contains(value.toLowerCase(), `password`)) {
                throw new Error(`password can't contain the word 'password'`)
            }
        }
    }
}*/)

module.exports = User;
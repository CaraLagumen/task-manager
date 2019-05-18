const express = require(`express`);
const router = new express.Router();
const User = require(`../models/user`);
const auth = require(`../middleware/auth`);
const multer = require(`multer`);
const sharp = require(`sharp`);
const { sendWelcomeEmail, sendDeletionEmail } = require(`../emails/account`);

router.get(`/test`, (req, res) => {
    res.send(`from a new file`);
})

router.post(`/users`, async (req, res) => {
    // console.log(req.body);
    // res.send(`testing`);
    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }

    //NOT ASYNC
    // user.save().then(() => {
    //     res.status(201).send(user);
    // }).catch((error) => {
    //     res.status(400).send(error);
    // })
})


//SIGNING IN
router.post(`/users/login`, async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password); //CREATE OWN METHOD
        const token = await user.generateAuthToken();
        // res.send({ user, token }); //NOT PRIVATE
        // res.send( { user: user.getPublicProfile(), token });
        res.send( { user, token }); //SHORTHAND OF ABOVE THANKS TO toJSON - SEE USER MODEL
    } catch (e) {
        res.status(400).send(e);
    }
})

//SIGNING OUT
router.post(`/users/logout`, auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
})

//SIGNING OUT OF ALL SESSIONS
router.post(`/users/logoutAll`, auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
})

//GET YOUR PROFILE
router.get(`/users/me`, auth, async (req, res) => {
    res.send(req.user);
})

//GET EVERYONE'S PROFILES
router.get(`/users`, auth, async (req, res) => { //SECOND ARGUMENT SHOULD BE THE MIDDLEWARE IF ANY
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send(e);
    }

    // User.find({}).then((users) => {
    //     res.send(users);
    // }).catch((error) => {
    //     res.status(500).send(error);
    // })
})


//GET SPECIFIC PROFILE
router.get(`/users/:id`, async (req, res) => {
    console.log(req.params); //ACCESS PARAMETERS
    const _id = req.params.id; //ACCESS PARAMETERS OF SPECIFIC ID

    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }

    // User.findById(_id).then((user) => {
    //     if (!user) {
    //         return res.status(404).send();
    //     }
    //     res.send(user);
    // }).catch((error) => {
    //     res.status(500).send(error);
    // })
})

//UPDATE PROFILE
// router.patch(`/users/:id`, async (req, res) => {
router.patch(`/users/me`, auth, async (req, res) => {
    const updates = Object.keys(req.body); //ex: "name", "age" KEY YOU WANT TO UPDATE
    const allowedUpdates = [`name`, `email`, `password`, `age`];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    //CHECKS IF EVERY UPDATE IS A VALID UPDATE
    if (!isValidOperation) {
        return res.status(400).send({ error: `Invalid updates!` })
    }
    try {
        //GET MIDDLEWARE TO RUN TO PASSWORD HASH
        // const user = await User.findById(req.params.id);
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        })
        await req.user.save();

        //BYPASSES MONGOOSE/INEFFICIENT
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        //(ID'S PARAMS, PARAM TO UPDATE, ADDITIONAL OPTIONS)
        //RUN VALIDATORS VALIDATES ENTRIES AGAIN
        if (!req.user) {
            return res.status(404).send(); //CHECK IF USER VALID
        }
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
})

//DELETE PROFILE
// router.delete(`/users/:id`, auth, async (req, res) => {
router.delete(`/users/me`, auth, async (req, res) => { //ONLY ALLOW DELETION OF OWN USER
    try {
        // const user = await User.findByIdAndDelete(req.params.id);
        // const user = await User.findByIdAndDelete(req.user._id);
        // if (!user) {
        //     return res.status(404).send();
        // }
        await req.user.remove();
        sendDeletionEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
})

//UPLOAD AVATAR
const upload = multer({
    // dest: `avatars`,
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error(`Please upload an image.`));
        }
        cb(undefined, true);
    }
})
router.post(`/users/me/avatar`, auth, upload.single(`avatar`), async (req, res) => {
    //SET IMAGE MODIFICATIONS WITH SHARP
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer; //req.file.buffer; //CHECK BINARY WITH <IMG SRC="DATA:IMAGE/JPG;BASE64,INSERT BINARY DATA">
    await req.user.save();
    res.status(200).send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
})

//ALLOW USERS TO ACCESS AVATAR
router.get(`/users/:id/avatar`, async (req, res) => {
    try {
        const user = await User.findById(req.params.id); //FETCH USER
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set(`Content-Type`, `image/png`); //RESPONSE HEADER
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
})

//DELETE AVATAR
router.delete(`/users/me/avatar`, auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send();
}, (error, req, res, next) => {
    res.status(500).send({ error: error.message });
})

module.exports = router;
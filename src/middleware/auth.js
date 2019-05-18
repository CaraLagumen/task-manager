const jwt = require(`jsonwebtoken`);
const User = require(`../models/user`);

const auth = async (req, res, next) => {
    // console.log(`auth middleware`);
    // next();
    try {
        const token = req.header(`authorization`).replace(`Bearer `, ``);
        const decoded = jwt.verify(token, /*`thisismynewcourse`*/process.env.JWT_SECRET); //MOVED TO .ENV
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
        console.log(token);
    } catch (e) {
        res.status(401).send({ error: `please authenticate` });
    }
}

module.exports = auth;
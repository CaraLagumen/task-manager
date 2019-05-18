//SERVER SETUP
const express = require(`express`);
require(`./db/mongoose`); //CONNECT
// const User = require(`./models/user`);
// const Task = require(`./models/task`);
const userRouter = require(`./routers/user`);
const taskRouter = require(`./routers/task`);
const multer = require(`multer`);

const app = express();
const port = process.env.PORT; //|| 3000; //FOR HEROKU

//UPLOADING FILES
// const upload = multer({
//     dest: 'images', //SHORT FOR DESTINATION - WHERE ALL OF THE UPLOADS SHOULD GO
//     limits: { //LIMIT FILESIZE, ETC
//         fileSize: 1000000 //PER BYTE 1MIL FOR 1MB
//     },
//     fileFilter(req, file, cb) { //FILTER TYPES OF FILE
//         if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
//             return cb(new Error(`Please upload an image.`));
//         }
//         cb(undefined, true);
//         // cb(new Error(`File must be an image.`)); //UNSUCCESFUL CALLBACK
//         // cb(undefined, true); //SUCCESSFUL CALLBACK
//         // cb(undefined, false); //SILENTLY REJECT
//     }
// })

// const errorMiddleWare = (req, res, next) => {
//     throw new Error(`From my middleware.`);
// }
// app.post('/upload', upload.single('upload')/*errorMiddleWare*/, (req, res) => { //WITH MIDDLEWARE UPLOAD.SINGLE(TELLS MULTER WHERE TO FIND THE UPLOAD)
//     res.send();
// }, (error, req, res, next) => { //EXPRESS ERROR HANDLING
//     res.status(400).send({ error: error.message });
// })

//WITHOUT MIDDLEWARE
//NEW REQUEST -> RUN ROUTE HANDLER
//WITH MIDDLEWARE
//NEW REQUEST -> DO SOMETHING -> RUN ROUTE HANDLER
// app.use((req, res, next) => { //NEXT TO REGISTER MIDDLEWARE
//     // console.log(req.method, req.path);
//     // next();
//     if (req.method === 'GET') {
//         res.send(`get requests are disabled`);
//     } else {
//         next();
//     }
// })

//MIDDLEWARE FOR MAINTENANCE CODE
// app.use((req, res, next) => {
//     res.status(503).send(`server maintenance`);
// })

//EXPRESS METHOD CALLS
app.use(express.json());

// //CREATE NEW ROUTER
// const router = new express.Router();
// //SET UP THE ROUTES
// router.get(`/test`, (req, res) => {
//     res.send(`this is from my other router`);
// })
// app.use(router);

//LINK ROUTERS
app.use(userRouter);
app.use(taskRouter);

//WHAT HAPPENS WHEN WE USE TOJSON
// const pet = {
//     name: `Hal`
// }

// pet.toJSON = function () {
//     console.log(this);
//     // return this;
//     return {};
// }

// console.log(JSON.stringify(pet)); //RES.SEND STRINGIFIES

// const jwt = require(`jsonwebtoken`);
// // const bcrypt = require(`bcryptjs`);

// const myFunction = async () => {
//     const token = jwt.sign({ _id: `dummyID` }, `thisistheprivatekey`, { expiresIn: `7 days` }); //CREATE TOKEN
//     console.log(token);
//     const data = jwt.verify(token, `thisistheprivatekey`); //VERIFY TOKEN/USER IS AUTHENTICATED CORRECTLY
//     console.log(data);
//     // const password = `password`;
//     // const hashedPassword = await bcrypt.hash(password, 8); //PASSWORD TO HASH, NUMBER OF ROUNDS TO ENCRYPT
//     // console.log(password);
//     // console.log(hashedPassword);
//     // const isMatch = await bcrypt.compare(`password1`, hashedPassword); //CHECK IF ENTERED PASSWORD MATCHES
//     // console.log(isMatch);
// }

// myFunction();

// app.post(`/users`, async (req, res) => {
//     // console.log(req.body);
//     // res.send(`testing`);
//     const user = new User(req.body);

//     try {
//         await user.save();
//         res.status(201).send(user);
//     } catch (e) {
//         res.status(400).send(e);
//     }

//     //NOT ASYNC
//     // user.save().then(() => {
//     //     res.status(201).send(user);
//     // }).catch((error) => {
//     //     res.status(400).send(error);
//     // })
// })

// app.get(`/users`, async (req, res) => {

//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch (e) {
//         res.status(500).send(e);
//     }

//     // User.find({}).then((users) => {
//     //     res.send(users);
//     // }).catch((error) => {
//     //     res.status(500).send(error);
//     // })
// })

// app.get(`/users/:id`, async (req, res) => {
//     console.log(req.params); //ACCESS PARAMETERS
//     const _id = req.params.id; //ACCESS PARAMETERS OF SPECIFIC ID

//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e);
//     }

//     // User.findById(_id).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send();
//     //     }
//     //     res.send(user);
//     // }).catch((error) => {
//     //     res.status(500).send(error);
//     // })
// })

// app.patch(`/users/:id`, async (req, res) => {
//     const updates = Object.keys(req.body); //ex: "name", "age" KEY YOU WANT TO UPDATE
//     const allowedUpdates = [`name`, `email`, `password`, `age`];
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
//     //CHECKS IF EVERY UPDATE IS A VALID UPDATE
//     if (!isValidOperation) {
//         return res.status(400).send({ error: `Invalid updates!` })
//     }
//     try {
//         const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//         //(ID'S PARAMS, PARAM TO UPDATE, ADDITIONAL OPTIONS)
//         //RUN VALIDATORS VALIDATES ENTRIES AGAIN
//         if (!user) {
//             return res.status(404).send(); //CHECK IF USER VALID
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(400).send(e);
//     }
// })

// app.delete(`/users/:id`, async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send();
//     }
// })

// app.post(`/tasks`, async (req, res) => {
//     const task = new Task(req.body);

//     try {
//         await task.save();
//         res.status(201).send(task);
//     } catch (e) {
//         res.status(400).send(e);
//     }

//     // task.save().then(() => {
//     //     res.status(201).send(task);
//     // }).catch((error) => {
//     //     res.status(400).send(error);
//     // })
// })

// app.get(`/tasks`, async (req, res) => {
//     try {
//         const tasks = await Task.find({});
//         res.send(tasks);
//     } catch (e) {
//         res.status(500).send(e);
//     }

//     // Task.find({}).then((tasks) => {
//     //     res.send(tasks);
//     // }).catch((error) => {
//     //     res.status(500).send(error);
//     // })
// })

// app.get(`/tasks/:id`, async (req, res) => {
//     const _id = req.params.id;

//     try {
//         const task = await Task.findById(_id);
//         if (!task) {
//             return res.status(404).send();
//         }
//         res.send(task);
//     } catch (e) {
//         res.status(500).send(e);
//     }

//     // Task.findById(_id).then((task) => {
//     //     if (!task) {
//     //         return res.status(404).send();
//     //     }
//     //     res.send(task);
//     // }).catch((error) => {
//     //     res.status(500).send(error);
//     // })
// })

// app.patch(`/tasks/:id`, async (req, res) => {
//     const updates = Object.keys(req.body);
//     const allowedUpdates = [`description`, `completed`];
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

//     if (!isValidOperation) {
//         return res.send(400).send({ error: `Invalid updates!` });
//     }
//     try {
//         const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//         if (!task) {
//             return res.send(404).send();
//         }
//         res.send(task);
//     } catch (e) {
//         res.send(400).send(e);
//     }
// })

// app.delete(`/tasks/:id`, async (req, res) => {
//     const task = await Task.findByIdAndDelete(req.params.id);
//     try {
//         if (!task) {
//             return res.status(404).send();
//         }
//         res.send(task);
//     } catch (e) {
//         res.status(500).send();
//     }
// })

app.listen(port, () => {
    console.log(`server is up on port ${port}`);
})

// HOW POPULATE WORKS
// const Task = require(`./models/task`);
// const User = require(`./models/user`);

// const main = async () => {
//     const task = await Task.findById(`5ccce5e89a6c414e54548e72`);
//     await task.populate(`owner`).execPopulate(); //GRAB THE WHOLE OWNER OBJECT
//     console.log(task.owner); 

//     const user = await User.findById(`5ccce5d69a6c414e54548e70`);
//     await user.populate(`tasks`).execPopulate();
//     console.log(user.tasks);
// }

// main();
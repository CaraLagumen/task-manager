const express = require(`express`);
const router = new express.Router();
const Task = require(`../models/task`);
const auth = require(`../middleware/auth`);

router.post(`/tasks`, auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body, //COPY ALL REQ.BODY
        owner: req.user._id //ADD OWNER PROPERTY
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }

    // task.save().then(() => {
    //     res.status(201).send(task);
    // }).catch((error) => {
    //     res.status(400).send(error);
    // })
})

//CATEGORIZE - GET /tasks?completed=true
//PAGINATION - GET /tasks?limit=10&skip=10
//SORT - GET /tasks?sortBy=createdAt:descending
router.get(`/tasks`, auth, async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === `true`;
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(`:`);
        sort[parts[0]] = parts[1] === `descending` ? -1 : 1; //sort[parts[0]] = CREATEDAT
    }

    try {
        // const tasks = await Task.find({});
        // const tasks = await Task.find({ owner: req.user._id }); //WORKS LIKE BELOW
        await req.user.populate(/*'tasks'*/{
            path: `tasks`, //CATEGORIZE
            match,
            options: { //PAGINATION
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort//: { //SORT
                //     // createdAt: -1 //DESCENDING
                //     // completed: 1 //ASCENDING
                // }
            }
        }).execPopulate();
        // res.send(tasks);
        res.send(req.user.tasks); //ONLY WORKS WITH POPULATE
    } catch (e) {
        res.status(500).send(e);
    }

    // Task.find({}).then((tasks) => {
    //     res.send(tasks);
    // }).catch((error) => {
    //     res.status(500).send(error);
    // })
})

router.get(`/tasks/:id`, auth, async (req, res) => {
    const _id = req.params.id;

    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }

    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send();
    //     }
    //     res.send(task);
    // }).catch((error) => {
    //     res.status(500).send(error);
    // })
})

router.patch(`/tasks/:id`, auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [`description`, `completed`];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.send(400).send({ error: `Invalid updates!` });
    }
    try {
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        // updates.forEach((update) => task[update] = req.body[update]); //BRACKET NOTATION TO GET DYNAMIC RESULT
        // await task.save();

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.send(404).send();
        }
        updates.forEach((update) => task[update] = req.body[update]); //BRACKET NOTATION TO GET DYNAMIC RESULT
        await task.save();
        res.send(task);
    } catch (e) {
        res.send(400).send(e);
    }
})

router.delete(`/tasks/:id`, auth, async (req, res) => {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    try {
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
})

module.exports = router;
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {}
);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const userSchema = new mongoose.Schema({
    roll: String,
    password: String,
    role: String
})

const User = new mongoose.model("User", userSchema)

const querySchema = new mongoose.Schema({
    exam_name: String,
    course_name: String,
    question_num: Number,
    ta_roll: String,
    std_roll: String,
    ta_comment: String,
    std_comment: String,
    IsActive: Boolean
})

const Query = new mongoose.model("Query", querySchema)

app.post("/login", (req, res) => {
    const { roll, password, role } = req.body
    User.findOne({ roll: roll }, (err, user) => {
        if (user) {
            if (password === user.password && role == user.role) {
                res.send({ message: "Login Successfull", user: user })
            }
            else if (password != user.password) {
                res.send({ message: "Password didn't match" })
            }
            else {
                res.send({ message: "User not registered" })
            }
        } else {
            res.send({ message: "User not registered" })
        }
    })
})

app.post("/register", (req, res) => {
    const { roll, password, role } = req.body
    User.findOne({ roll: roll }, (err, user) => {
        if (user) {
            res.send({ message: "User already registerd" })
        }
        else {
            const user = new User({
                roll,
                password,
                role
            })
            user.save(err => {
                if (err) {
                    res.send({ message: "Successfully Registered, Please login now." })
                } else {
                    res.send({ message: "Successfully Registered, Please login now." })
                }
            })
        }
    })

})

app.post("/student/addQuery", (req, res) => {
    const { exam_name, course_name, question_num, ta_roll, std_roll, ta_comment, std_comment, IsActive } = req.body

    const query = new Query({
        exam_name, course_name, question_num, ta_roll, std_roll, ta_comment, std_comment, IsActive
    })
    query.save(err => {
        if (err) {
            res.send({ message: "Query saved successfully." })
        } else {
            res.send({ message: "Query saved successfully." })
        }
    })
})

app.get('/query/get', (req, res) => {
    Query.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(data);
        }
    });
});

app.post('/query/update', (req, res) => {
    Query.findByIdAndUpdate(req.body._id, { $set: { ta_comment: req.body.ta_comment, IsActive: "false" } }
        , (err, response) => {
            if (err) {
                res.send({ message: "user updated!" })
            } else {
                res.send({ message: "user updated!" })
            }
        });
});


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
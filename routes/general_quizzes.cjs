const router = require("express").Router();
const generalQuizzes = require("../models/general_quizzes.cjs");

//Submit

router.post("/general_quizzes/new", async (req, res) => {
    const randInt = Math.floor(Math.random() * 101);
    const theseanswers = [{id:randInt,name:"me"}]
    try {
        const newGeneralQuizzes = new generalQuizzes({
            id: randInt,
            question:req.body.question,
            answers: theseanswers,
            correctAnswer: req.body.correctAnswer,
            points: req.body.points,
        });
        const generalQuiz = await  newGeneralQuizzes.save();
        res.send(generalQuiz);
    }
    catch (err) {
        res.send(err);
    }
})

//get Blogs
router.get("/general_quizzes", (req, res) => {
    try {
        generalQuizzes.find()
        .then((quizzes) => {
            res.send(quizzes);
        });
    }
    catch (err) {
        res.send(err);
    }

})

module.exports = router
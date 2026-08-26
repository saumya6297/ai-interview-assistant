import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    collection,
    addDoc
} from "firebase/firestore";
import { db } from "../firebase/config";
import auth from "../firebase/auth";
import "./Interview.css";

import Sidebar from "../component/Sidebar";

function Interview() {


    const navigate = useNavigate();


    const [started, setStarted] = useState(false);

    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");

    const [experience, setExperience] = useState("Fresher");

    const [questionCount, setQuestionCount] = useState(10);

    const [questions, setQuestions] = useState([]);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [answer, setAnswer] = useState("");

    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [progress, setProgress] = useState(0);

    const [timeLeft, setTimeLeft] = useState(60);




    // =========================
    // Gemini Question Generate
    const generateQuestions = async () => {
        if (!category) {

            alert("Please Select Job Role");

            return;

        }

        try {

            const response = await fetch(
                "http://localhost:5000/generate-questions",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        category,
                        difficulty,
                        experience,
                        questionCount

                    })

                }
            );

            const data = await response.json();

            if (!data.questions) {

                alert(data.error || "Questions Generate nahi hue");

                return;

            }

            const generatedQuestions = data.questions
                .split("\n")
                .filter(q => q.trim() !== "")
                .map(q => q.replace(/^\d+\.\s*/, ""));

            setQuestions(generatedQuestions);

            setStarted(true);

            setProgress(10);

        }

        catch (error) {

            console.log(error);

            alert("Server Error");

        }

    };

    useEffect(() => {

        if (!started) return;

        if (loading) return;

        if (timeLeft <= 0) {
            submitAnswer(true);
            return;
        }

        const timer = setTimeout(() => {

            setTimeLeft(prev => prev - 1);

        }, 1000);

        return () => clearTimeout(timer);

    }, [timeLeft, started, loading]);
    // =========================
    // Submit Answer
    // =========================


    const submitAnswer = async (autoSubmit = false) => {
        setLoading(true);

        if (answer.trim() === "" && !autoSubmit) {
            alert("Please enter your answer");
            setLoading(false);
            return;
        }

        const newAnswers = [


            ...answers,


            {


                question: questions[currentQuestion],


                answer: answer


            }


        ];




        setAnswers(newAnswers);





        if (currentQuestion < questions.length - 1) {

            setCurrentQuestion(currentQuestion + 1);

            setAnswer("");

            setProgress(
                ((currentQuestion + 2) / questions.length) * 100
            );

            setTimeLeft(60);

            setLoading(false);

            return;

        }



        else {


            const user = auth.currentUser;




            if (!user) {


                alert("User not logged in");

                return;


            }





            let score = 0;




            newAnswers.forEach((item) => {


                if (item.answer.length > 20) {


                    score++;


                }


            });







            // =========================
            // Gemini AI Feedback
            // =========================


            let feedback = "AI feedback not generated";




            try {


                const feedbackResponse = await fetch(


                    "http://localhost:5000/generate-feedback",


                    {


                        method: "POST",


                        headers: {


                            "Content-Type": "application/json"


                        },


                        body: JSON.stringify({


                            answers: newAnswers


                        })


                    }


                );




                const feedbackData =

                    await feedbackResponse.json();




                feedback = feedbackData.feedback;




            }

            catch (error) {


                console.log(

                    "Feedback error",

                    error

                );


            }







            // =========================
            // Save Firebase
            // =========================


            await addDoc(

                collection(

                    db,

                    "users",

                    user.uid,

                    "interviews"

                ),

                {

                    category,

                    difficulty,

                    experience,

                    questionCount,

                    answers: newAnswers,

                    score: `${score}/${questions.length}`,

                    feedback,

                    date: new Date(),
                    hidden: false

                }

            );










            alert(

                `Interview Completed 🎉 Score: ${score}/${questions.length}`

            );

            setLoading(false);

            navigate("/dashboard");


        }


    };









    return (
        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-content">




                <div className="interview-container">



                    <div className="interview-card">





                        <h1>

                            AI Interview Assistant 🤖

                        </h1>





                        <button

                            className="back-btn"

                            onClick={() => navigate("/dashboard")}

                        >

                            ⬅ Back to Dashboard


                        </button>





                        <p>

                            Prepare yourself for your next interview 🚀

                        </p>
                        {
                            started && (

                                <>

                                    <div className="progress-box">

                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${progress}%`
                                            }}
                                        ></div>

                                    </div>

                                    <div className="timer">

                                        ⏳ Time Left : {timeLeft}s

                                    </div>

                                </>

                            )
                        }







                        {!started ?





                            <div>


                                <div className="interview-options">

                                    <h2>🚀 Start AI Interview</h2>

                                    <label>Job Role</label>

                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="">Select Role</option>
                                        <option>Frontend Developer</option>
                                        <option>Backend Developer</option>
                                        <option>Full Stack Developer</option>
                                        <option>React Developer</option>
                                        <option>Node.js Developer</option>
                                        <option>Python Developer</option>
                                        <option>Java Developer</option>
                                        <option>HR Interview</option>
                                    </select>

                                    <label>Difficulty</label>

                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                    >
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                    </select>

                                    <label>Experience</label>

                                    <select
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                    >
                                        <option>Fresher</option>
                                        <option>0-1 Years</option>
                                        <option>2-5 Years</option>
                                        <option>5+ Years</option>
                                    </select>

                                    <label>Number of Questions</label>

                                    <select
                                        value={questionCount}
                                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                        <option value={20}>20</option>
                                    </select>

                                    <button
                                        className="start-interview-btn"
                                        onClick={generateQuestions}
                                    >
                                        🚀 Start Interview
                                    </button>

                                </div>
                            </div>





                            :





                            <div>



                                <h2>

                                    Question {currentQuestion + 1}

                                </h2>




                                <p className="question">

                                    {questions[currentQuestion]}

                                </p>





                                <textarea

                                    placeholder="Type your answer here..."

                                    value={answer}

                                    onChange={(e) => setAnswer(e.target.value)}

                                    rows={8}

                                    disabled={loading}

                                />





                                <button

                                    onClick={submitAnswer}

                                    disabled={loading}

                                >

                                    {

                                        loading

                                            ?

                                            "Submitting..."

                                            :

                                            "Submit Answer"

                                    }

                                </button>




                            </div>





                        }




                    </div>



                </div>

            </div>
        </div>

    )
}






export default Interview;
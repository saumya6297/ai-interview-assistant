import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
import Sidebar from "../component/Sidebar";
// import Navbar from "../component/Navbar";
// import {
//     doc,
//     getDoc,
//     collection,
//     getDocs
// } from "firebase/firestore";

import auth from "../firebase/auth";
import { db } from "../firebase/config";

import "./Dashboard.css";
import {
    collection,
    getDocs,
    query,
    orderBy
} from "firebase/firestore";
import { useUser } from "../context/UserContext";

function Dashboard() {
    const { userData, loading } = useUser();

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-mode");
    };

    // const [userData, setUserData] = useState(null);

    const [stats, setStats] = useState({

        total: 0,

        highest: "0/0",

        average: "0",

        lastCategory: "No Interview"

    });

    // const [loading, setLoading] = useState(true);

    // useEffect(() => {

    //     loadDashboard();

    // }, []);

    const loadDashboard = async () => {
        try {
            const user = auth.currentUser;

            if (!user) {
                navigate("/login");
                return;
            }

            // ===========================
            // INTERVIEW HISTORY
            // ===========================

            const interviewRef = query(
                collection(
                    db,
                    "users",
                    user.uid,
                    "interviews"
                ),
                orderBy("date", "desc")
            );

            const interviewSnap = await getDocs(interviewRef);

            let total = 0;
            let highest = 0;
            let highestTotal = 0;
            let totalMarks = 0;
            let lastCategory = "No Interview";

            interviewSnap.forEach((interviewDoc) => {
                const data = interviewDoc.data();

                if (!data.score) return;

                total++;

                const scoreParts = data.score.split("/");

                const obtained = Number(scoreParts[0]);
                const totalQuestions = Number(scoreParts[1]);

                totalMarks += obtained;

                if (obtained > highest) {
                    highest = obtained;
                    highestTotal = totalQuestions;
                }

                if (total === 1) {
                    lastCategory = data.category || "Unknown";
                }
            });

            const average =
                total === 0
                    ? "0"
                    : (totalMarks / total).toFixed(1);

            setStats({
                total,
                highest:
                    total === 0
                        ? "0/0"
                        : `${highest}/${highestTotal}`,
                average,
                lastCategory
            });

        } catch (error) {
            console.error("Dashboard Error:", error);
        }
    };
    useEffect(() => {
        if (!loading) {
            loadDashboard();
        }
    }, [loading]);

    if (loading) {

        return (

            <div className="dashboard-loading">

                <h2>Loading Dashboard...</h2>

            </div>

        );

    }



    return (
        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-content">
                {/* 
                <Navbar user={userData} /> */}

                <div className="dashboard-page">
                    {/* ```jsx
                    <button
                        className={`theme-toggle ${darkMode ? "on" : ""}`}
                        onClick={toggleDarkMode}
                        aria-label="Toggle dark mode"
                    >
                        <span className="toggle-circle">
                            {darkMode ? "🌙" : "☀️"}
                        </span>
                    </button> */}
                    


                    <div className="dashboard-container">

                        <div className="dashboard">

                            <div className="dashboard-card">

                                <div className="welcome-card">



                                    {/* Dark Mode Toggle */}
                                    <button
                                        className={`theme-toggle ${darkMode ? "on" : ""}`}
                                        onClick={toggleDarkMode}
                                        aria-label="Toggle dark mode"
                                    >
                                        <span className="toggle-circle">
                                            {darkMode ? "🌙" : "☀️"}
                                        </span>
                                    </button>





                                    <div className="welcome-left">

                                        <p className="today-date">
                                            📅 {today}
                                        </p>

                                        <h1>
                                            👋 Welcome Back, {userData?.firstName || "User"}
                                        </h1>

                                        <p>
                                            Ready to crack your next interview?
                                            Practice with AI and improve every day.
                                        </p>

                                        <div className="welcome-email">

                                            📧 {userData?.email}

                                        </div>

                                    </div>

                                    <div className="welcome-right">

                                        <div className="robot-circle">

                                            🤖

                                        </div>

                                    </div>

                                </div>

                                <div className="stats-container">



                                    <div className="stat-card">

                                        <div className="stat-icon">📊</div>

                                        <h3>Total Interviews</h3>

                                        <h1>{stats.total}</h1>

                                    </div>



                                    <div className="stat-card">

                                        <div className="stat-icon">🏆</div>

                                        <h3>Highest Score</h3>

                                        <h1>{stats.highest}</h1>

                                    </div>



                                    <div className="stat-card">

                                        <div className="stat-icon">⭐</div>

                                        <h3>Average Score</h3>

                                        <h1>{stats.average}</h1>

                                    </div>


                                    <div className="stat-card">

                                        <div className="stat-icon">💼</div>

                                        <h3>Last Category</h3>

                                        <h1>{stats.lastCategory}</h1>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );




    {/* AI Motivation */ }

    <div className="quote-card">

        <h2>💡 Today's AI Tip</h2>

        <p>

            Every interview improves your confidence.

            Don't fear mistakes — learn from them and keep practicing.

        </p>

    </div>





}

export default Dashboard; 
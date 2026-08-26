import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import {
//     collection,
//     getDocs,
//     query,
//     orderBy
// } from "firebase/firestore";
import { db } from "../firebase/config";
import auth from "../firebase/auth";
import "./MyInterviews.css";
import Sidebar from "../component/Sidebar";
import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc
} from "firebase/firestore";

function MyInterviews() {

    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [openInterview, setOpenInterview] = useState(null);
    const [search, setSearch] = useState("");


    const [filter, setFilter] = useState("All");

    const [sort, setSort] = useState("Newest");

    useEffect(() => {

        loadInterviews();

    }, []);

    const loadInterviews = async () => {

        try {

            const user = auth.currentUser;

            if (!user) {

                navigate("/login");

                return;

            }

            const q = query(

                collection(

                    db,

                    "users",

                    user.uid,

                    "interviews"

                ),

                orderBy("date", "desc")

            );

            const snapshot = await getDocs(q);

            const list = [];

            snapshot.forEach((doc) => {

                const data = doc.data();

                if (!data.hidden) {

                    list.push({

                        id: doc.id,

                        ...data

                    });

                }

            });
            setInterviews(list);

            setLoading(false);

        }

        catch (error) {

            console.log(error);

            setLoading(false);

        }



    };
    const archiveInterview = async (id) => {
        console.log("Archive Clicked", id);

        const confirmArchive = window.confirm(
            "Archive this interview?"
        );

        if (!confirmArchive) return;

        try {
            console.log("Updating Firebase...");
            const user = auth.currentUser;

            await updateDoc(

                doc(
                    db,
                    "users",
                    user.uid,
                    "interviews",
                    id
                ),
                {
                    hidden: true
                }
            );
            console.log("Updated Successfully");

            loadInterviews();

        }

        catch (error) {

            console.log(error);

            alert("Unable to archive interview.");
        }

    };
    if (loading) {

        return (

            <div className="my-container">

                <h2>Loading Interviews...</h2>

            </div>

        );

    }

    return (
        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-content">


                <div className="my-container">

                    <div className="my-card">

                        <h1>📋 My Interviews</h1>
                        <div className="search-container">

                            <div className="top-controls">

                                <input
                                    type="text"
                                    className="search-box"
                                    placeholder="🔍 Search by Category..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <select
                                    className="filter-box"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >

                                    <option value="All">All Categories</option>

                                    <option value="HR">HR</option>

                                    <option value="Technical">Technical</option>

                                    <option value="Developer">Developer</option>

                                    <option value="Frontend">Frontend</option>

                                    <option value="Backend">Backend</option>

                                    <option value="Full Stack">Full Stack</option>

                                    <option value="Java">Java</option>

                                    <option value="Python">Python</option>

                                    <option value="C++">C++</option>

                                    <option value="Data Structure">Data Structure</option>

                                    <option value="DBMS">DBMS</option>

                                    <option value="OOPs">OOPs</option>

                                    <option value="JavaScript">JavaScript</option>

                                    <option value="React">React</option>

                                    <option value="Node.js">Node.js</option>
                                </select>
                                <select
                                    className="filter-box"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option value="Newest">Newest</option>

                                    <option value="Oldest">Oldest</option>

                                    <option value="Highest">Highest Score</option>

                                </select>

                            </div>
                        </div>

                        <button
                            className="back-btn"
                            onClick={() => navigate("/dashboard")}
                        >
                            ⬅ Back to Dashboard
                        </button>

                        {

                            interviews.length === 0 ? (

                                <h2>No Interviews Found 😔</h2>

                            ) : (

                                <div className="result-box">

                                    {

                                        interviews
                                            .filter((interview) => {

                                                const searchMatch =
                                                    interview.category
                                                        ?.toLowerCase()
                                                        .includes(search.toLowerCase());

                                                const filterMatch =
                                                    filter === "All" ||
                                                    interview.category === filter;

                                                return searchMatch && filterMatch;

                                            })

                                            .sort((a, b) => {

                                                if (sort === "Newest") {

                                                    return b.date.seconds - a.date.seconds;

                                                }

                                                if (sort === "Oldest") {

                                                    return a.date.seconds - b.date.seconds;

                                                }

                                                if (sort === "Highest") {

                                                    return Number(b.score.split("/")[0]) -
                                                        Number(a.score.split("/")[0]);

                                                }

                                                return 0;

                                            })

                                            .map((interview, index) => (
                                                <div
                                                    className="interview-history-card"
                                                    key={interview.id}
                                                >

                                                    <div
                                                        className="history-header"
                                                        onClick={() =>
                                                            setOpenInterview(
                                                                openInterview === interview.id
                                                                    ? null
                                                                    : interview.id
                                                            )
                                                        }
                                                    >

                                                        <h2>
                                                            📋 Interview #{index + 1}
                                                        </h2>

                                                        <span>
                                                            {openInterview === interview.id ? "▲" : "▼"}
                                                        </span>

                                                    </div>

                                                    {
                                                        openInterview === interview.id && (
                                                            <>

                                                                <p>
                                                                    <b>📂 Category :</b> {interview.category}
                                                                </p>

                                                                <p>
                                                                    <b>🎯 Difficulty :</b> {interview.difficulty}
                                                                </p>

                                                                <p>
                                                                    <b>👨‍💻 Experience :</b> {interview.experience}
                                                                </p>

                                                                <p>
                                                                    <b>❓ Questions :</b> {interview.questionCount}
                                                                </p>

                                                                <p>
                                                                    <b>⭐ Score :</b> {interview.score}
                                                                </p>

                                                                <p>
                                                                    <b>📅 Date :</b>
                                                                    {
                                                                        interview.date?.toDate
                                                                            ? interview.date.toDate().toLocaleString()
                                                                            : "No Date"
                                                                    }
                                                                </p>

                                                                <div className="feedback-box">

                                                                    <h3>🤖 AI Feedback</h3>

                                                                    <p>
                                                                        {interview.feedback || "No AI Feedback Available."}
                                                                    </p>

                                                                </div>

                                                                <h3>📝 Questions & Answers</h3>

                                                                {
                                                                    (interview.answers || []).map((item, i) => (

                                                                        <div
                                                                            className="answer-card"
                                                                            key={i}
                                                                        >

                                                                            <h4>
                                                                                Q{i + 1}: {item.question}
                                                                            </h4>

                                                                            <p>
                                                                                <b>Your Answer :</b>
                                                                                <br />
                                                                                {item.answer}
                                                                            </p>

                                                                        </div>

                                                                    ))
                                                                }
                                                                <button
                                                                    className="archive-btn"
                                                                    onClick={() => archiveInterview(interview.id)}
                                                                >
                                                                    📦 Archive Interview
                                                                </button>
                                                            </>
                                                        )
                                                    }

                                                </div>



                                            ))

                                    }

                                </div>

                            )

                        }

                    </div>

                </div>

            </div>

        </div>

    );

}




export default MyInterviews;
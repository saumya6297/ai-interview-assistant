import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../component/Sidebar";

import auth from "../firebase/auth";
import { db } from "../firebase/config";

import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc,
    deleteDoc
} from "firebase/firestore";

import { useUser } from "../context/UserContext";

import "./ArchivedInterviews.css";

function ArchivedInterviews() {

    const navigate = useNavigate();

    const { userData, loading } = useUser();

    const [interviews, setInterviews] = useState([]);

    useEffect(() => {

        if (!loading && userData) {

            loadArchived();

        }

    }, [loading, userData]);

    const loadArchived = async () => {

        try {

            if (!userData) return;

            const q = query(

                collection(
                    db,
                    "users",
                    userData.uid,
                    "interviews"
                ),

                orderBy("date", "desc")

            );

            const snapshot = await getDocs(q);

            const list = [];

            snapshot.forEach((doc) => {

                const data = doc.data();

                if (data.hidden) {

                    list.push({

                        id: doc.id,

                        ...data

                    });

                }

            });

            setInterviews(list);

        }

        catch (error) {

            console.log(error);

        }

    };
    const restoreInterview = async (id) => {

        try {

            if (!userData) return;

            await updateDoc(

                doc(
                    db,
                    "users",
                    userData.uid,
                    "interviews",
                    id
                ),

                {
                    hidden: false
                }

            );

            loadArchived();

        }

        catch (error) {

            console.log(error);

            alert("Unable to restore interview.");

        }

    };

    const deleteInterview = async (id) => {

        const confirmDelete = window.confirm(
            "⚠️ This interview will be permanently deleted.\n\nContinue?"
        );

        if (!confirmDelete) return;

        try {

            if (!userData) return;

            await deleteDoc(

                doc(
                    db,
                    "users",
                    userData.uid,
                    "interviews",
                    id
                )

            );

            setInterviews(prev =>
                prev.filter(item => item.id !== id)
            );

            alert("🗑 Interview deleted successfully.");

        }

        catch (error) {

            console.log(error);

            alert("Unable to delete interview.");

        }

    };

    if (loading) {

        return (
            <h2 style={{ textAlign: "center", marginTop: "40px" }}>
                Loading Archived Interviews...
            </h2>
        );

    }
    return (

        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-content">

                <div className="my-container">

                    <div className="my-card">

                        <h1>📦 Archived Interviews</h1>

                        {
                            interviews.length === 0 ? (

                                <h2>No Archived Interviews 📦</h2>

                            ) : (

                                <div className="result-box">

                                    {

                                        interviews.map((interview, index) => (

                                            <div
                                                className="interview-history-card"
                                                key={interview.id}
                                            >

                                                <h2>
                                                    📋 Interview #{index + 1}
                                                </h2>

                                                <p>
                                                    <b>📂 Category :</b> {interview.category}
                                                </p>

                                                <p>
                                                    <b>⭐ Score :</b> {interview.score}
                                                </p>

                                                <p>
                                                    <b>📅 Date :</b>{" "}
                                                    {
                                                        interview.date?.toDate
                                                            ? interview.date
                                                                .toDate()
                                                                .toLocaleString()
                                                            : "No Date"
                                                    }
                                                </p>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "12px",
                                                        marginTop: "15px",
                                                        flexWrap: "wrap"
                                                    }}
                                                >

                                                    <button
                                                        className="restore-btn"
                                                        onClick={() =>
                                                            restoreInterview(interview.id)
                                                        }
                                                    >
                                                        🔄 Restore Interview
                                                    </button>

                                                    <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            deleteInterview(interview.id)
                                                        }
                                                    >
                                                        🗑 Delete Forever
                                                    </button>

                                                </div>

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

export default ArchivedInterviews;
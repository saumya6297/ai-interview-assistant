import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";

import auth from "../firebase/auth";
import { updatePassword } from "firebase/auth";
import { db } from "../firebase/config";

import Sidebar from "../component/Sidebar";
import "./Profile.css";
import { useUser } from "../context/UserContext";
function Profile() {
    const { userData, loading, setUserData } = useUser();

    // const [userData, setUserData] = useState(null);

    const [stats, setStats] = useState({
        total: 0,
        highest: "0/0",
        average: "0",
        joined: "-"
    });

    // const [loading, setLoading] = useState(true);

    const [editMode, setEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    useEffect(() => {

        if (!userData) return;

        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");

        setStats(prev => ({
            ...prev,
            joined:
                userData.createdAt?.toDate?.().toLocaleDateString() ||
                "Recently Joined"
        }));

        loadInterviewStats();

    }, [userData]);

    // const loadProfile = async () => {

    //     try {

    //         const user = auth.currentUser;

    //         if (!user) return;

    //         const snap = await getDoc(
    //             doc(db, "users", user.uid)
    //         );

    //         if (snap.exists()) {

    //             const data = snap.data();

    //             setUserData(data);

    //             setFirstName(data.firstName);

    //             setLastName(data.lastName);

    //             setStats(prev => ({
    //                 ...prev,
    //                 joined:
    //                     data.createdAt?.toDate?.().toLocaleDateString() ||
    //                     "Recently Joined"
    //             }));

    //         }

    //         setLoading(false);

    //     }

    //     catch (err) {

    //         console.log(err);

    //         setLoading(false);

    //     }

    // };

    const loadInterviewStats = async () => {

        const user = auth.currentUser;

        const snapshot = await getDocs(

            collection(
                db,
                "users",
                user.uid,
                "interviews"
            )

        );

        let total = 0;

        let highest = 0;

        let highestTotal = 0;

        let sum = 0;

        snapshot.forEach((doc) => {

            const data = doc.data();

            if (data.hidden) return;

            total++;

            const score = Number(data.score.split("/")[0]);

            const totalMarks = Number(data.score.split("/")[1]);

            sum += score;

            if (score > highest) {

                highest = score;

                highestTotal = totalMarks;

            }

        });

        setStats(prev => ({

            ...prev,

            total,

            highest: `${highest}/${highestTotal}`,

            average:
                total === 0
                    ? "0"
                    : (sum / total).toFixed(1)

        }));

    };

    const changePassword = async () => {

        const user = auth.currentUser;

        if (!user) {
            alert("Please login again.");
            return;
        }

        if (!newPassword || !confirmPassword) {
            alert("Please enter both password fields.");
            return;
        }

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {

            await updatePassword(user, newPassword);

            alert("✅ Password Changed Successfully");

            setNewPassword("");
            setConfirmPassword("");
            setShowPassword(false);

        } catch (error) {

            console.error("Password Change Error:", error);

            if (error.code === "auth/requires-recent-login") {
                alert("For security, please logout and login again before changing your password.");
            } else {
                alert("❌ Unable to change password. Please try again.");
            }

        }
    };


    const saveProfile = async () => {

        const user = auth.currentUser;

        await updateDoc(

            doc(db, "users", user.uid),

            {
                firstName,
                lastName
            }

        );

        setUserData({

            ...userData,

            firstName,

            lastName

        });

        setEditMode(false);

        alert("✅ Profile Updated Successfully");

    };

    if (loading) {

        return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

    }
    return (

        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-content">

                <div className="profile-page">

                    <div className="profile-card">

                        {/* Avatar */}

                        <div className="profile-avatar">

                            {userData?.firstName?.charAt(0).toUpperCase()}

                        </div>

                        <h1>

                            {userData?.firstName} {userData?.lastName}

                        </h1>

                        <p className="profile-email">

                            {userData?.email}

                        </p>

                        {/* Information */}

                        <div className="profile-details">

                            <div className="profile-item">

                                <label>👤 First Name</label>

                                {

                                    editMode ?

                                        <input

                                            type="text"

                                            value={firstName}

                                            onChange={(e) => setFirstName(e.target.value)}

                                        />

                                        :

                                        <p>{userData?.firstName}</p>

                                }

                            </div>

                            <div className="profile-item">

                                <label>👤 Last Name</label>

                                {

                                    editMode ?

                                        <input

                                            type="text"

                                            value={lastName}

                                            onChange={(e) => setLastName(e.target.value)}

                                        />

                                        :

                                        <p>{userData?.lastName}</p>

                                }

                            </div>

                            <div className="profile-item">

                                <label>📧 Email</label>

                                <p>{userData?.email}</p>

                            </div>

                            <div className="profile-item">

                                <label>📅 Joined Date</label>

                                <p>{stats.joined}</p>

                            </div>

                            <div className="profile-item">

                                <label>🎤 Total Interviews</label>

                                <p>{stats.total}</p>

                            </div>

                            <div className="profile-item">

                                <label>🏆 Highest Score</label>

                                <p>{stats.highest}</p>

                            </div>

                            <div className="profile-item">

                                <label>⭐ Average Score</label>

                                <p>{stats.average}</p>

                            </div>
                            {/* Change Password Card */}

                            <div className="profile-item change-password-card">

                                <label>🔐 Change Password</label>

                                {!showPassword ? (

                                    <button
                                        className="change-password-btn"
                                        onClick={() => setShowPassword(true)}
                                    >
                                        Change Password
                                    </button>

                                ) : (

                                    <div className="password-content">

                                        <input
                                            type="password"
                                            placeholder="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />

                                        <input
                                            type="password"
                                            placeholder="Confirm New Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />

                                        <div className="password-buttons">

                                            <button
                                                className="password-save-btn"
                                                onClick={changePassword}
                                            >
                                                🔒 Update Password
                                            </button>

                                            <button
                                                className="password-cancel-btn"
                                                onClick={() => {
                                                    setShowPassword(false);
                                                    setNewPassword("");
                                                    setConfirmPassword("");
                                                }}
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    </div>

                                )}

                            </div>


                        </div>

                        {/* Buttons */}

                        <div className="profile-buttons">

                            {

                                editMode ?

                                    <>

                                        <button

                                            className="save-btn"

                                            onClick={saveProfile}

                                        >

                                            💾 Save Changes

                                        </button>

                                        <button

                                            className="cancel-btn"

                                            onClick={() => {

                                                setEditMode(false);

                                                setFirstName(userData.firstName);

                                                setLastName(userData.lastName);

                                            }}

                                        >

                                            ❌ Cancel

                                        </button>

                                    </>

                                    :

                                    <button

                                        className="edit-btn"

                                        onClick={() => setEditMode(true)}

                                    >

                                        ✏️ Edit Profile

                                    </button>

                            }

                        </div>



                    </div>

                </div>

            </div>

        </div>

    );
}
export default Profile;
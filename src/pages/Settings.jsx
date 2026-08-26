import "./Settings.css";
import { useEffect, useState } from "react";
import {
    signOut,
    sendEmailVerification,
    onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import auth from "../firebase/auth";
import Sidebar from "../component/Sidebar";


function Settings() {

    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(false);

    const [notification, setNotification] = useState(true);
    const [user, setUser] = useState(null);
    // useEffect(() => {

    //     const savedDarkMode = localStorage.getItem("darkMode");
    //     if (savedDarkMode === "true") {

    //         document.body.classList.add("dark-theme");

    //     }

    //     else {

    //         document.body.classList.remove("dark-theme");

    //     }

    //     const savedNotification = localStorage.getItem("notification");

    //     if (savedDarkMode !== null) {
    //         setDarkMode(savedDarkMode === "true");
    //     }

    //     if (savedNotification !== null) {
    //         setNotification(savedNotification === "true");
    //     }
    //     setUser(auth.currentUser);

    // }, []);
    // useEffect(() => {

    //     const loadSettings = async () => {

    //         const user = auth.currentUser;

    //         if (!user) return;

    //         try {

    //             const snap = await getDoc(
    //                 doc(db, "users", user.uid)
    //             );

    //             if (snap.exists()) {

    //                 const data = snap.data();

    //                 const savedDarkMode = data.darkMode ?? false;
    //                 const savedNotification = data.notification ?? true;

    //                 setDarkMode(savedDarkMode);
    //                 setNotification(savedNotification);

    //                 if (savedDarkMode) {

    //                     document.body.classList.add("dark-theme");

    //                 } else {

    //                     document.body.classList.remove("dark-theme");

    //                 }

    //             } else {

    //                 setDarkMode(false);
    //                 setNotification(true);

    //                 document.body.classList.remove("dark-theme");

    //             }

    //         } catch (error) {

    //             console.log("Settings load error:", error);

    //         }

    //         setUser(user);

    //     };

    //     loadSettings();

    // }, []);
    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {

            if (!user) {

                setDarkMode(false);
                setNotification(true);
                setUser(null);

                document.body.classList.remove("dark-theme");

                return;
            }

            try {

                // const snap = await getDoc(
                //     doc(db, "users", user.uid)
                // );
                const snap = await getDoc(
                    doc(db, "users", user.uid),
                    { source: "server" }
                );

                if (snap.exists()) {

                    const data = snap.data();

                    const savedDarkMode = data.darkMode ?? false;
                    const savedNotification = data.notification ?? true;
                    console.log("CURRENT USER:", user.uid);
                    console.log("FIREBASE DARK MODE:", data.darkMode);

                    setDarkMode(savedDarkMode);
                    setNotification(savedNotification);
                    setUser(user);

                    if (savedDarkMode) {

                        document.body.classList.add("dark-theme");

                    } else {

                        document.body.classList.remove("dark-theme");

                    }

                } else {

                    setDarkMode(false);
                    setNotification(true);
                    setUser(user);

                    document.body.classList.remove("dark-theme");

                }

            } catch (error) {

                console.log("Settings load error:", error);

                setDarkMode(false);
                setNotification(true);

                document.body.classList.remove("dark-theme");

            }

        });

        return () => unsubscribe();

    }, []);

    // const saveSettings = () => {

    //     localStorage.setItem("darkMode", darkMode);

    //     localStorage.setItem("notification", notification);

    //     if (darkMode) {

    //         document.body.classList.add("dark-theme");

    //     }

    //     else {

    //         document.body.classList.remove("dark-theme");

    //     }

    //     alert("✅ Settings Saved Successfully");

    // };
    // const verifyEmail = async () => {

    //     try {

    //         if (auth.currentUser) {

    //             await sendEmailVerification(auth.currentUser);

    //             alert("📩 Verification email sent successfully.");

    //         }

    //     }

    //     catch (error) {

    //         console.log(error);

    //         alert("Unable to send verification email.");

    //     }

    // };
    const saveSettings = async () => {

        const user = auth.currentUser;

        if (!user) return;

        try {

            await setDoc(
                doc(db, "users", user.uid),
                {
                    darkMode: darkMode,
                    notification: notification
                },
                {
                    merge: true
                }
            );

            if (darkMode) {

                document.body.classList.add("dark-theme");

            } else {

                document.body.classList.remove("dark-theme");

            }

            alert("✅ Settings Saved Successfully");

        } catch (error) {

            console.log("Settings save error:", error);

            alert("❌ Unable to save settings.");

        }

    };

    const logoutUser = async () => {

        // Remove previous user's dark mode
        document.body.classList.remove("dark-theme");

        // Clear old browser setting
        localStorage.removeItem("darkMode");
        localStorage.removeItem("notification");

        await signOut(auth);

        navigate("/login");

    };
    return (

        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-content">

                <div className="settings-page">

                    <div className="settings-card">

                        <h1>⚙️ Settings</h1>

                        <p className="settings-subtitle">
                            Customize your AI Interview Assistant
                        </p>

                        {/* ================= Account ================= */}

                        <div className="setting-title">
                            👤 Account
                        </div>

                        <div
                            className="setting-box clickable"
                            onClick={() => navigate("/profile")}
                        >
                            <div className="setting-left">
                                👤 Edit Profile
                            </div>

                            <span>➜</span>
                        </div>

                        <div
                            className="setting-box clickable"
                            onClick={() => navigate("/change-password")}
                        >
                            <div className="setting-left">
                                🔒 Change Password
                            </div>

                            <span>➜</span>
                        </div>

                        {/* ================= AI Preferences ================= */}

                        <div className="setting-title">
                            🤖 AI Preferences
                        </div>

                        <div className="setting-box">

                            <div className="setting-left">
                                🎯 Interview Difficulty
                            </div>

                            <select className="setting-select">

                                <option>Easy</option>

                                <option>Medium</option>

                                <option>Hard</option>

                            </select>

                        </div>

                        <div className="setting-box">

                            <div className="setting-left">
                                🌙 Dark Mode
                            </div>

                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={() => setDarkMode(!darkMode)}
                            />

                        </div>

                        <div className="setting-box">

                            <div className="setting-left">
                                🔔 Notifications
                            </div>

                            <input
                                type="checkbox"
                                checked={notification}
                                onChange={() => setNotification(!notification)}
                            />

                        </div>

                        {/* ================= About ================= */}

                        <div className="setting-title">
                            ℹ️ About
                        </div>

                        <div className="setting-box">

                            <div className="setting-left">
                                📱 Version
                            </div>

                            <span>v1.0.0</span>

                        </div>

                        <div className="setting-box">

                            <div className="setting-left">
                                👨‍💻 Developer
                            </div>

                            <strong>Saumya ❤️</strong>

                        </div>

                        {/* ================= Buttons ================= */}

                        <button
                            className="save-btn"
                            onClick={saveSettings}
                        >
                            💾 Save Settings
                        </button>

                        <button
                            className="logout-btn"
                            onClick={logoutUser}
                        >
                            🚪 Logout
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}
export default Settings;
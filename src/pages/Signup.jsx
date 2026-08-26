import { useState } from "react";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    reload
} from "firebase/auth";


import {
    doc,
    setDoc,
    serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase/config";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

import { auth } from "../firebase/config";


const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;

function Signup() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    // const [phone, setPhone] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);

    const signupUser = async () => {
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Confirm Password:", confirmPassword);

        if (!strongPassword.test(password)) {
            alert("Password must be 8+ characters with capital, small, number and special character");
            return;
        }


        if (password !== confirmPassword) {
            alert("Password not matched");
            return;
        }


        try {

            // await createUserWithEmailAndPassword(
            //     auth,
            //     email,
            //     password
            // );
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;
            await sendEmailVerification(user);

            await setDoc(doc(db, "users", user.uid), {
                firstName,
                lastName,
                email,
                createdAt: serverTimestamp()
            });



            setVerificationSent(true);
        }

        catch (error) {

            alert(error.message);

        }



    };
    const checkEmailVerification = async () => {
        try {
            const user = auth.currentUser;

            if (!user) {
                alert("User not found. Please login again.");
                navigate("/login");
                return;
            }

            await reload(user);

            if (user.emailVerified) {
                alert("Email verified successfully! 🎉");
                navigate("/dashboard");
            } else {
                alert("Email is not verified yet. Please verify your email first.");
            }

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };
    return (

        <div className="login-page">

            {verificationSent ? (

                <div className="login-box">

                    <h1>Check Your Email 📧</h1>

                    <p className="subtitle">
                        We have sent a verification link to:
                    </p>

                    <p style={{ textAlign: "center", fontWeight: "bold" }}>
                        {email}
                    </p>

                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                        Please open your email and click the verification link.
                    </p>

                    <button onClick={checkEmailVerification}>
                        I Have Verified My Email
                    </button>

                </div>

            ) : (

                <div className="login-box">

                    <h1>Create Account</h1>

                    <p className="subtitle">
                        AI Interview Assistant
                    </p>

                    <label>First Name</label>

                    <input
                        type="text"
                        placeholder="e.g. Shreya"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />

                    <label>Last Name</label>

                    <input
                        type="text"
                        placeholder="e.g. Sharma"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />

                    <label>Email Address</label>

                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password</label>

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <label>Confirm Password</label>

                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <div className="signup-method">

                        <p>Choose how you want to verify your account</p>

                        <button type="button" onClick={signupUser}>
                            Sign Up with Email
                        </button>

                    </div>

                    <p className="bottom-text">
                        Already have an account?{" "}
                        <Link to="/login">Login</Link>
                    </p>

                </div>

            )}

        </div>

    );




}


export default Signup;
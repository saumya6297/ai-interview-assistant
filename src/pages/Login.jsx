import { useState } from "react";
import {
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { auth } from "../firebase/config";
import "./Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const loginUser = async () => {


        try {


            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            if (!user.emailVerified) {

                await signOut(auth);

                alert(
                    "📩 Please verify your email before logging in.\n\n" +
                    "Check your Gmail inbox and click the verification link."
                );

                return;
            }

            alert("Login Successful 🎉");
            navigate("/dashboard");

        }



        catch (error) {

            console.log("Login Error:", error.code);

            if (error.code === "auth/user-not-found") {

                alert("❌ No account found with this email.");

            }
            else if (error.code === "auth/wrong-password" ||
                error.code === "auth/invalid-credential") {

                alert("❌ Incorrect email or password.");

            }
            else if (error.code === "auth/invalid-email") {

                alert("⚠️ Please enter a valid email address.");

            }
            else if (error.code === "auth/too-many-requests") {

                alert("⚠️ Too many login attempts. Please try again later.");

            }
            else {

                alert("❌ Login failed. Please try again.");

            }

        }
    }


    return (

        <div className="login-container">


            <div className="login-box">


                <h1>🤖 AI Interview Assistant</h1>

                <p className="subtitle">
                    Welcome back! Login to continue your AI interview journey 👋
                </p>

                <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />


                <button onClick={loginUser}>

                    Login

                </button>
                <p className="forgot-password">
                    <Link to="/forgot-password">
                        Forgot Password?
                    </Link>
                </p>


                <p className="bottom-text">

                    Don't have an account?

                    <Link to="/signup">
                        Sign Up
                    </Link>

                </p>








            </div>


        </div>


    )


}


export default Login;
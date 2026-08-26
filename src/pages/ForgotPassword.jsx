import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import auth from "../firebase/auth";
import "./Login.css";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const resetPassword = async () => {

        setMessage("");
        setError("");

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        try {

            setLoading(true);

            await sendPasswordResetEmail(auth, email);

            setMessage(
                "📩 Password reset email sent successfully. Please check your Gmail."
            );

        } catch (error) {

            if (error.code === "auth/user-not-found") {

                setError("❌ Email doesn't exist.");

            } else if (error.code === "auth/invalid-email") {

                setError("❌ Please enter a valid email address.");

            } else {

                setError("❌ Unable to send reset email. Please try again.");

            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-container">

            <div className="login-box">

                <h1>🔐 Forgot Password?</h1>

                <p className="subtitle">
                    Enter your registered email address
                </p>

                <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    onClick={resetPassword}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send Reset Email"}
                </button>

                {message && (
                    <p style={{ color: "green", marginTop: "15px" }}>
                        {message}
                    </p>
                )}

                {error && (
                    <p style={{ color: "red", marginTop: "15px" }}>
                        {error}
                    </p>
                )}

                <p className="bottom-text">

                    <Link to="/login">
                        ← Back to Login
                    </Link>

                </p>

            </div>

        </div>

    );
}

export default ForgotPassword;
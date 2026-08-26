import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "firebase/auth";
import { auth } from "../firebase/config";

function Verify() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const method = searchParams.get("method");

    const [contact, setContact] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);

    const sendOTP = async () => {
        try {
            if (method !== "phone") {
                alert("Email verification abhi setup nahi hua hai.");
                return;
            }

            if (!contact) {
                alert("Please enter your phone number");
                return;
            }

            if (!contact.startsWith("+91") || contact.length !== 13) {
                alert("Please enter a valid Indian phone number with +91");
                return;
            }

            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier(
                    auth,
                    "recaptcha-container",
                    {
                        size: "normal",
                        callback: () => {
                            console.log("reCAPTCHA solved");
                        },
                        "expired-callback": () => {
                            window.recaptchaVerifier = null;
                            console.log("reCAPTCHA expired");
                        }
                    }
                );
            }

            const appVerifier = window.recaptchaVerifier;

            const confirmationResult = await signInWithPhoneNumber(
                auth,
                contact,
                appVerifier
            );

            window.confirmationResult = confirmationResult;

            setShowOtp(true);

            alert("OTP sent successfully!");
        } catch (error) {
            console.error("FULL FIREBASE ERROR:", error);
            alert(`${error.code}\n${error.message}`);
        }
    };
    const verifyOTP = async () => {
        try {
            if (!otp || otp.length !== 6) {
                alert("Please enter 6 digit OTP");
                return;
            }

            await window.confirmationResult.confirm(otp);

            alert("Phone verified successfully!");

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Invalid OTP");
        }
    };

    const changeMethod = () => {
        if (method === "phone") {
            navigate("/verify?method=email");
        } else {
            navigate("/verify?method=phone");
        }
    };

    return (
        <div className="login-page">

            <div className="login-box">

                <h1>Verify Your Account</h1>

                <p className="subtitle">
                    {showOtp
                        ? "Enter the OTP sent to you"
                        : method === "phone"
                            ? "Verify your phone number"
                            : "Verify your email address"}
                </p>

                {!showOtp ? (
                    <>
                        <label>
                            {method === "phone"
                                ? "Phone Number"
                                : "Email Address"}
                        </label>

                        <input
                            type={method === "phone" ? "tel" : "email"}
                            placeholder={
                                method === "phone"
                                    ? "+91XXXXXXXXXX"
                                    : "example@gmail.com"
                            }
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                        />
                        <div id="recaptcha-container"></div>

                        <button onClick={sendOTP}>
                            Verify
                        </button>

                        <p
                            onClick={changeMethod}
                            style={{
                                color: "#2563eb",
                                cursor: "pointer",
                                textAlign: "center",
                                marginTop: "15px"
                            }}
                        >
                            {method === "phone"
                                ? "Use email instead"
                                : "Use phone number instead"}
                        </p>
                    </>
                ) : (
                    <>
                        <label>Enter OTP</label>

                        <input
                            type="text"
                            maxLength="6"
                            placeholder="Enter 6 digit OTP"
                            value={otp}
                            onChange={(e) =>
                                setOtp(e.target.value.replace(/\D/g, ""))
                            }
                        />

                        <button onClick={verifyOTP}>
                            Verify OTP
                        </button>

                        <p
                            onClick={() => setShowOtp(false)}
                            style={{
                                color: "#2563eb",
                                cursor: "pointer",
                                textAlign: "center",
                                marginTop: "15px"
                            }}
                        >
                            Change phone/email
                        </p>
                    </>
                )}

            </div>

        </div>
    );
}

export default Verify;
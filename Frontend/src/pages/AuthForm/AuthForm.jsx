// Frontend/src/pages/AuthForm/AuthForm.jsx
import React, { useState } from "react";
import "./AuthForm.css";
import registerImg from "../../assets/register.svg";
import loginImg from "../../assets/log.svg";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useStore } from "../../Context/StoreContext.jsx";

const AuthForm = () => {
    const navigate = useNavigate();
    const { setUser } = useStore();
    const [isSignUpMode, setIsSignUpMode] = useState(false);

    // Sign In form state
    const [siEmail, setSiEmail] = useState("");
    const [siPassword, setSiPassword] = useState("");

    // Sign Up form state
    const [suName, setSuName] = useState("");
    const [suEmail, setSuEmail] = useState("");
    const [suPassword, setSuPassword] = useState("");

    // UX state
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const clearMsg = () => setMsg({ type: "", text: "" });

    const handleSignIn = async (e) => {
        e.preventDefault();
        clearMsg();
        setLoading(true);
        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ensure cookie is accepted and stored
                body: JSON.stringify({ email: siEmail, password: siPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Login failed");

            if (data?.user) {
                setUser(data.user); // hydrate global auth state
            }

            setMsg({ type: "success", text: "Logged in successfully" });
            navigate("/", { replace: true });
        } catch (err) {
            setMsg({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        clearMsg();
        setLoading(true);
        try {
            const res = await fetch("/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    username: suName,
                    email: suEmail,
                    password: suPassword,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Registration failed");

            setMsg({ type: "success", text: "Registered successfully, please sign in" });
            setIsSignUpMode(false);
        } catch (err) {
            setMsg({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`containerR ${isSignUpMode ? "sign-up-mode" : ""}`}>
            <div className="formsContainerR">
                <div className="signinSignupR">
                    {/* Sign In Form */}
                    <form className="signInFormR" onSubmit={handleSignIn}>
                        <h2 className="titleR">Sign in</h2>
                        <div className="inputFieldR">
                            <MdOutlineAlternateEmail />
                            <input
                                type="email"
                                id="SiEmail"
                                placeholder="Email"
                                value={siEmail}
                                onChange={(e) => setSiEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="inputFieldR">
                            <TbLockPassword />
                            <input
                                type="password"
                                id="SiPassword"
                                placeholder="Password"
                                value={siPassword}
                                onChange={(e) => setSiPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <button type="submit" id="SignIn" className="btnR solidR" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                        <p className="socialTextR">Or Sign in with social platforms</p>
                        <div className="socialMediaR">
                            <a href="#" className="socialIconR" aria-label="Google sign in">
                                <FcGoogle />
                            </a>
                        </div>
                    </form>

                    {/* Sign Up Form */}
                    <form className="signUpFormR" onSubmit={handleSignUp}>
                        <h2 className="titleR">Sign up</h2>
                        <div className="inputFieldR">
                            <FaRegUser />
                            <input
                                type="text"
                                id="SuName"
                                placeholder="Username"
                                value={suName}
                                onChange={(e) => setSuName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="inputFieldR">
                            <MdOutlineAlternateEmail />
                            <input
                                type="email"
                                id="SuEmail"
                                placeholder="Email"
                                value={suEmail}
                                onChange={(e) => setSuEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="inputFieldR">
                            <TbLockPassword />
                            <input
                                type="password"
                                id="SuPassword"
                                placeholder="Password"
                                value={suPassword}
                                onChange={(e) => setSuPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <button type="submit" id="SignUp" className="btnR" disabled={loading}>
                            {loading ? "Signing up..." : "Sign up"}
                        </button>
                        <p className="socialTextR">Or Sign up with social platforms</p>
                        <div className="socialMediaR" style={{ marginBottom: "25px" }}>
                            <a href="#" className="socialIconR" aria-label="Google sign up">
                                <FcGoogle />
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            {/* Panels */}
            <div className="panelsContainerR">
                <div className="panelR leftPanelR">
                    <div className="contentR">
                        <h3>New here ?</h3>
                        <p>
                            Split, Settle, Smile! Join the vibrant community at SplitMate and track and share expenses with ease.
                        </p>
                        <button
                            type="button"
                            className="btnR transparentR"
                            onClick={() => setIsSignUpMode(true)}
                        >
                            Sign up
                        </button>
                    </div>
                    <img src={loginImg} className="imageR" alt="login" />
                </div>

                <div className="panelR rightPanelR">
                    <div className="contentR">
                        <h3>One of us ?</h3>
                        <p>
                            Already on SplitMate? Sign in to keep tracking, sharing, and settling expenses with your crew.
                        </p>
                        <button
                            type="button"
                            className="btnR transparentR"
                            onClick={() => setIsSignUpMode(false)}
                        >
                            Sign in
                        </button>
                    </div>
                    <img src={registerImg} className="imageR" alt="register" />
                </div>
            </div>

            {/* Global message area */}
            {msg.text && (
                <div
                    style={{
                        maxWidth: 480,
                        margin: "16px auto",
                        color: msg.type === "error" ? "crimson" : "seagreen",
                        textAlign: "center",
                    }}
                    role="status"
                    aria-live="polite"
                >
                    {msg.text}
                </div>
            )}
        </div>
    );
};

export default AuthForm;

import React, { useState, useRef, useEffect } from "react";
import "./AuthForm.css";
import register from "../../assets/register.svg"
import login from "../../assets/log.svg"
import { FcGoogle } from "react-icons/fc";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa6";


const AuthForm = () => {
    const [isSignUpMode, setIsSignUpMode] = useState(false);


    // No need for querySelector - use React state and event handlers instead

    return (
        <div className={`containerR ${isSignUpMode ? "sign-up-mode" : ""}`}>
            <div className="formsContainerR">
                <div className="signinSignupR">
                    {/* Sign In Form */}
                    <form action="#" className="signInFormR">
                        <h2 className="titleR">Sign in</h2>
                        <div className="inputFieldR">
                            <MdOutlineAlternateEmail />
                            <input type="email" id="SiEmail" placeholder="Email" />
                        </div>
                        <div className="inputFieldR">
                           <TbLockPassword />
                            <input type="password" id="SiPassword" placeholder="Password" />
                        </div>
                        <input type="button"
                            id="SignIn"
                            className="btnR solidR"
                            value="Sign in"
                        />
                        <p className="socialTextR">Or Sign in with social platforms</p>
                        <div className="socialMediaR">
                            <a href="#" className="socialIconR">
                                <FcGoogle />
                            </a>
                            {/* <a href="#" className="socialIconR">
                                <TiVendorMicrosoft />
                            </a>
                            <a href="#" className="socialIconR">
                                
                            </a> */}
                        </div>
                    </form>

                    {/* Sign Up Form */}
                    <form action="#" className="signUpFormR">
                        <h2 className="titleR">Sign up</h2>
                        <div className="inputFieldR">
                            <FaRegUser />
                            <input type="text" id="SuName" placeholder="Username" />
                        </div>
                        <div className="inputFieldR">
                            <MdOutlineAlternateEmail />
                            <input type="email" id="SuEmail" placeholder="Email" />
                        </div>
                        <div className="inputFieldR">
                            <TbLockPassword />
                            <input type="password" id="SuPassword" placeholder="Password" />
                        </div>
                        <input
                            type="button"
                            id="SignUp"
                            className="btnR"
                            value="Sign up"
                        />
                        <p className="socialTextR">Or Sign up with social platforms</p>
                        <div className="socialMediaR" style={{marginBottom: '25px'}}>
                            <a href="#" className="socialIconR">
                                <FcGoogle />
                            </a>
                            {/* <a href="#" className="socialIconR">
                                <TiVendorMicrosoft />
                            </a>
                            <a href="#" className="socialIconR">
                                
                            </a> */}
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
                            Split, Settle, Smile! Join the vibrant community at SplitMate.
                            Sign up today and start tracking and sharing expenses with ease!
                        </p>
                        <button
                            className="btnR transparentR"
                            onClick={() => setIsSignUpMode(true)}
                        >
                            Sign up
                        </button>
                    </div>
                    <img src={login} className="imageR" alt="login" />
                </div>

                <div className="panelR rightPanelR">
                    <div className="contentR">
                        <h3>One of us ?</h3>
                        <p>
                            Already one of us? Welcome back to SplitMate!
                            Sign in to keep tracking, sharing, and settling expenses with your crew.
                        </p>
                        <button
                            className="btnR transparentR"
                            onClick={() => setIsSignUpMode(false)}
                        >
                            Sign in
                        </button>
                    </div>
                    <img src={register} className="imageR" alt="register" />
                </div>
            </div>
        </div>
    );
};

export default AuthForm;

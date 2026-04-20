import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/logo.png";
import { auth, login, signup } from "../../firebase";
import netflix_spinner from "../../assets/netflix_spinner.gif";
const Login = () => {
const navigate = useNavigate();
const [searchParams] = useSearchParams();
const initialMode = searchParams.get("mode") === "signup" ? "Sign Up" : "Sign In";

const [signState, setSignState] = React.useState(initialMode);
const [name, setName] = React.useState("");
const [email, setEmail] = React.useState("");
const [password, setPassword] = React.useState("");
const [errorMessage, setErrorMessage] = React.useState("");
const [isSubmitting, setIsSubmitting] = React.useState(false);

React.useEffect(() => {
    setSignState(initialMode);
}, [initialMode]);

React.useEffect(() => {
    if (auth.currentUser) {
        navigate("/", { replace: true });
    }
}, [navigate]);

const user_auth=async(event)=>{
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const trimmedEmail = email.trim();

    try {
        if(signState==="Sign In"){
            await login(trimmedEmail, password);
        }else{
            await signup(name.trim(), trimmedEmail, password);
        }

        navigate("/", { replace: true });
    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            setSignState("Sign In");
            setErrorMessage("That email already has an account. Sign in instead.");
            return;
        }

        if (error.code === "auth/invalid-credential") {
            setErrorMessage("That email or password is incorrect.");
            return;
        }

        if (error.code === "auth/weak-password") {
            setErrorMessage("Password should be at least 6 characters.");
            return;
        }

        if (error.code === "auth/invalid-email") {
            setErrorMessage("Enter a valid email address.");
            return;
        }

        setErrorMessage("Unable to continue right now. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
}


    return (
        <div className="login">
            <Link to="/">
                <img src={logo} className="login-logo" alt="Streaming Demo" />
            </Link>

            <div className="login-form">
                <p className="login-disclaimer">
                    Demo only. Do not use real personal, financial, or production credentials.
                </p>
                <h1>{signState}</h1>
                <form onSubmit={user_auth}>
                {signState === "Sign Up" ?
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Username" /> : <></>}
                <input value={email} onChange={(e) => { setEmail(e.target.value); setErrorMessage(""); }} type="email" placeholder="Email" />
                    <input value={password} onChange={(e) => { setPassword(e.target.value); setErrorMessage(""); }} type="password" placeholder="Password" />
                    {errorMessage ? <p className="login-error">{errorMessage}</p> : null}
                    <button type='submit' disabled={isSubmitting}>{isSubmitting ? "Please wait..." : signState}</button>
                    <div className="form-help">
                        <div className="remember-me">   
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <p>Need help?</p>
                    </div>
                    <div className="form-switch">
                        {signState === "Sign In" ? <p>New to this demo? <span onClick={() => { setSignState("Sign Up"); setErrorMessage(""); }}>Create Demo Account.</span></p> : <></>}
                        {signState === "Sign Up" ? <p>Already have an account? <span onClick={() => { setSignState("Sign In"); setErrorMessage(""); }}>Sign In Now</span></p> : <></>}
                        
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;


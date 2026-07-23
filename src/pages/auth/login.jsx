import {
    EyeClosedIcon,
    EyeOpenIcon,
    LockClosedIcon,
    PersonIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
export default function Login() {
    const { register, handleSubmit } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (data) => {
        let formData = data;

        setError('')
        try {
            setError('')
            const loggedin = await login(formData);
            // console.log('Login status: ', loggedin);
            if (loggedin?.statusCode == 200) {
                console.log('success');
                navigate('/');
            } else {
                setError(loggedin.message);
            }

        } catch (err) {

            console.log(err.status);
            if (err.status === 400) {
                setError("User not found");

            } else if (err.status === 401) {
                setError("Invalid credentials");

            } else {
                setError("Something went wrong");
            }

        }
    };

    return (<>

        <div className="min-h-screen flex items-center justify-center bg-bg-main text-text-main relative overflow-hidden transition-colors duration-200">

            {/* Background Shapes */}
            <div className="absolute top-20 left-0 w-80 h-80 bg-primary/5 rotate-45 rounded-3xl"></div>
            <div className="absolute bottom-0 left-40 w-96 h-96 bg-primary/5 rotate-45 rounded-3xl"></div>
            <div className="absolute top-40 right-0 w-72 h-72 bg-primary/5 rotate-45 rounded-3xl"></div>

            <form onSubmit={handleSubmit(handleLogin)} className="relative z-10">

                {/* Login Card */}
                <div className="bg-surface border border-border-main w-[420px] rounded-2xl shadow-2xl p-8 z-10">

                    {/* Title */}
                    <h1 className="text-4xl font-extrabold text-center mb-8 text-text-main tracking-tight">
                        Login
                    </h1>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-500 text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {/* Username */}
                    <div className="text-left mt-3">
                        <label className="text-xs font-semibold text-text-sub uppercase tracking-wider">Username</label>
                    </div>
                    <div className="flex items-center border-b border-border-main py-3 mb-6 focus-within:border-primary transition-colors">
                        <PersonIcon className="text-text-muted mr-3" />
                        <input
                            type="text"
                            required
                            {...register("username")}
                            placeholder="Type your username"
                            className="w-full outline-none bg-transparent text-text-main placeholder-text-muted text-sm"
                        />
                    </div>

                    {/* Password */}
                    <div className="text-left mt-3">
                        <label className="text-xs font-semibold text-text-sub uppercase tracking-wider">Password</label>
                    </div>
                    <div className="flex items-center border-b border-border-main py-3 focus-within:border-primary transition-colors">
                        <LockClosedIcon className="text-text-muted mr-3" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            {...register("password")}
                            placeholder="Type your password"
                            className="w-full outline-none bg-transparent text-text-main placeholder-text-muted text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="ml-2 focus:outline-none cursor-pointer"
                        >
                            {showPassword ? (
                                <EyeClosedIcon className="text-text-sub" />
                            ) : (
                                <EyeOpenIcon className="text-text-sub" />
                            )}
                        </button>
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right mt-3">
                        <a
                            href="#"
                            className="text-xs text-text-muted hover:text-primary transition"
                        >
                            Forgot Password?
                        </a>
                    </div>

                    {/* Login Button */}
                    <button className="w-full mt-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm shadow-lg active:scale-95 transition duration-150 cursor-pointer"
                        type="submit"
                    >
                        LOGIN
                    </button>

                    {/* Redirect to Signup */}
                    <div className="text-center mt-6 text-xs text-text-sub">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="text-primary hover:underline font-semibold bg-transparent border-none cursor-pointer"
                        >
                            Sign up here
                        </button>
                    </div>

                </div>

            </form >
        </div >


    </>
    );
}
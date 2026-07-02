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
            const loggedin = await login(formData)

            console.log(loggedin);
            navigate('/searchresult');

        } catch (err) {
            if (err) {
                setError(err.message);
            }

            console.error('Login error : ', error);
        }
    };




    return (<>

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 relative overflow-hidden">

            {/* Background Shapes */}
            <div className="absolute top-20 left-0 w-80 h-80 bg-white/10 rotate-45 rounded-3xl"></div>
            <div className="absolute bottom-0 left-40 w-96 h-96 bg-white/5 rotate-45 rounded-3xl"></div>
            <div className="absolute top-40 right-0 w-72 h-72 bg-black/10 rotate-45 rounded-3xl"></div>

            <form onSubmit={handleSubmit(handleLogin)} className="relative z-10">

                {/* Login Card */}
                <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-8 z-10">

                    {/* Title */}
                    <h1 className="text-5xl font-bold text-center mb-10 text-gray-800">
                        Login
                    </h1>

                    {/* Username */}
                    <div className="text-left mt-3">
                        <label className="text-sm text-gray-700 justify-left">Username</label>
                    </div>
                    <div className="flex items-center border-b border-gray-300 py-3 mb-6">
                        <PersonIcon className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            {...register("username")}
                            placeholder="Type your username"
                            className="w-full outline-none text-gray-700 placeholder-gray-400"
                        />
                    </div>

                    {/* Password */}
                    <div className="text-left mt-3">
                        <label className="text-sm text-gray-700 ">Password</label>
                    </div>
                    <div className="flex items-center border-b border-gray-300 py-3">
                        <LockClosedIcon className="text-gray-400 mr-3" />
                        <input
                            type={showPassword ? "text" : "password"}
                            showPassword={false}
                            {...register("password")}
                            placeholder="Type your password"
                            className="w-full outline-none text-gray-700 placeholder-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="ml-2 focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeClosedIcon className="text-gray-400" />
                            ) : (
                                <EyeOpenIcon className="text-gray-400" />
                            )}
                        </button>
                    </div>



                    {/* Forgot Password */}
                    <div className="text-right mt-3">
                        <a
                            href="#"
                            className="text-sm text-gray-500 hover:text-pink-500 transition"
                        >
                            Forgot Password?
                        </a>
                    </div>

                    {/* Login Button */}
                    <button className="w-full mt-8 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 text-white font-semibold text-lg shadow-lg hover:scale-105 transition duration-300"
                        type="submit"
                    >
                        LOGIN
                    </button>

                </div>

            </form >
        </div >


    </>
    );
}
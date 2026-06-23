import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";

export default function Login() {
    const { register, handleSubmit } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState('');

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
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Login form</h2>
            <form onSubmit={handleSubmit(handleLogin)}
                className="flex flex-col items-center justify-center min-h-screen bg-gray-500"
            >
                <input
                    {...register("username")}
                    placeholder="Enter username"
                    className="p-10"

                />
                <input {...register("password")} placeholder="Enter password" />

                {error && <p className="text-red-500">{error}</p>}
                <input type="checkbox" id="remember" name="remember" />
                <label htmlFor="remember"> Remember me..</label>

                <button type="submit">Submit..</button>


            </form>
            <div>
                <p>Don't have an account ? <a href="#" className="text-blue-500">Sign up</a></p>

            </div>
        </div>


    </>
    );
}
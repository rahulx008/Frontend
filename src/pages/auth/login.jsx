import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "../../context/authContext.jsx";

export default function Login() {
    const { register, handleSubmit } = useForm();
    const { login } = useAuth();

    const [error, setError] =useState('');

    const handleLogin = async (data) => {
        let formData = data;

        setError('')
        try {
            setError('')
            const loggedin= await login(formData)
            
            console.log(loggedin)
        } catch (err) {
            if (err) {
                setError(err.message);
            }
            
            console.error('Login error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleLogin)}>
            <input {...register("username")} placeholder="Enter username" />
            <input {...register("password")} placeholder="Enter password" />
            
            <button type="submit">Submit</button>
        </form>
    );
}
import { useForm } from "react-hook-form";
import { loginUser } from "../../api/userApi.js";
import { useState } from "react";

export default function Login() {
    const { register, handleSubmit } = useForm();

    const [error, setError] =useState('');

    const handleLogin = async (data) => {
        let formData = data;

        setError('')
        try {
            setError('')
            const loggedin= await loginUser(formData)
            
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
import { useState } from "react";
import asyncHandler from "../../utils/AsyncHandler";


export default function Signup (){
    const [loading, setLoading]= useState(false);
    const [error, setError] = useState(false);

    const handleSignup = asyncHandler(async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(false);    
        const formData = new FormData(event.target);
        const data = {
            fullname: formData.get('fullname'),
            email: formData.get('email'),
            username: formData.get('username'),
            password: formData.get('password'),
        };
    })
}
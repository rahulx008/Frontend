import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";


export default function Logout() {
    const { logout, user} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            console.log("Logged out successfully");
            //navigate to Home page or show a message
            navigate("/Login", { replace: true }); // Redirect to home page after logout
             // Go back to the previous page
            
        } catch (error) {
            console.error("Logout failed:", error);
            console.error("Logout failed. Please try again.");
        }
    }

    return (
        user && <button onClick={handleLogout}>Logout</button>
    );
    return;

}
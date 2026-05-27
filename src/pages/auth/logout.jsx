import { useAuth } from "../../context/authContext";    

export default function Logout() {
    const { logout, user} = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            console.log("Logged out successfully");
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
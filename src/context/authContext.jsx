import { createContext, useState, useEffect, useCallback, useContext } from "react";
import {useGetCurrentUser, useLogin, useRegister, useLogout} from "../queries/userQueries.js";


/* Authsetters are used to update the auth context from outside the 
    provider component, such as in login or signup pages, 
    without needing to pass down props through multiple levels of components.
    This allows for a more flexible and decoupled way to manage 
    authentication state across the application.
*/
let authSetters = {
    setUser: () => {},
};

/* Here we are setting the auth setter functions 
which will be used to update the auth context from outside the provider component */ 
export const setauthSetters = (setUserFn) => {
    authSetters.setUser = setUserFn;
}

// This function allows other components to access the auth setters without needing to import the entire context, 
// providing a more convenient way to update authentication state from anywhere in the app.
export const getAuthSetters = () => authSetters;



const AuthContext = createContext({
    user: null,
    register: async ()=>{},
    login: async ()=>{},
    logout: async ()=>{},
    isLoading: false,
    isAuthenticated: false,
});

export const AuthProvider = ({ children }) => {

    //if user data is stored in local storage, we can use it to initialize the user state, otherwise we start with null.
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            localStorage.removeItem('user');
            return null;
        }
    }); 

    // This function will be called to update the user state and also persist it in local storage, ensuring that the user's authentication state is maintained across page reloads.
        const hasAccessToken = Boolean(localStorage.getItem("accessToken"));

        const { data: currentUser, isLoading: loadingUserData } = useGetCurrentUser({
            enabled: !!user?._id && hasAccessToken,
        });

    const { mutateAsync: registerMutation, isLoading: registering } = useRegister();
    const { mutateAsync: loginMutation, isLoading: loggingIn } = useLogin();
    const { mutateAsync: logoutMutation, isLoading: loggingOut } = useLogout();

    const isAuthenticated = Boolean(currentUser?.data || user);

    const isLoading = loadingUserData || registering || loggingIn || loggingOut;


    // Whenever the 'currentUser' data changes, we want to update the 'user' state and also synchronize it with local storage.
    useEffect(() => {
        if (currentUser?.data) {
            setUser(currentUser.data);
            localStorage.setItem("user", JSON.stringify(currentUser.data));
        } else if (!currentUser && !user?._id) {
            localStorage.removeItem("user");
            setUser(null);
        }
    }, [currentUser]);

    useEffect(() => {
        setauthSetters(setUser);
    }, [setUser]);

    
    const login = useCallback(
        async (data) => {
            const res = await loginMutation(data);
            const { user, accessToken } = res.data;

            setUser(user);
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("user", JSON.stringify(user));

            return res;
        }, [loginMutation]
    );

    const register = useCallback(
        async (formData) => {
            await registerMutation(formData);
        }, [registerMutation]
    );

    const logout = useCallback(async () => {
        try {
            await logoutMutation();
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            setUser(null);
            console.log("Logged out successfully");
        } catch (error) {
            console.error("Logout failed:", error);
            console.error("Logout failed. Please try again.");
        }
        }, [logoutMutation]
    );

    const data = {
        user: currentUser?.data || user,
        setUser,
        login,
        register,
        logout,
        isAuthenticated,
        isLoading,
        logoutLoading: loggingOut,
    };

    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

export default AuthProvider;

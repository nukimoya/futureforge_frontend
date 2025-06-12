// src/context/AuthContextProvider.js
import { useReducer, useEffect, useState } from "react";
import { AuthReducer } from "../reducers/AuthReducers";
import { AuthContext } from "./authContext"; // import from separate file

const hydrateUser = () => {
    const user = localStorage.getItem("user");
    return { user: user ? JSON.parse(user) : null };
  };  

export default function AuthContextProvider({ children }) {
    const [authstate, dispatch] = useReducer(AuthReducer, hydrateUser());
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            dispatch({ type: "LOGIN", payload: user });
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...authstate, dispatch, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

"use client"

import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

// Define the User interface.
interface User {
    id: number,
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    phone: string;
}

// Define the State interface.
interface State {
    loading: boolean;
    error: string | null;
    data: User | null;
}

// Define the AuthState interface that extends State.
interface AuthState extends State {
   setAuthState: React.Dispatch<React.SetStateAction<State>>;
}

// Create the AuthenticationContext.
export const AuthenticationContext = createContext<AuthState>({
    loading: false,
    data: null,
    error: null,
    setAuthState: () => {},
});

// The AuthContext component.
export default function AuthContext({children}: {children: React.ReactNode}) {

    // Define the authState and setAuthState.
    const [authState, setAuthState] = useState<State>({
        loading: false,
        data: null,
        error: null,
    });

    // Define the fetchUser function that fetches user data based on the jwt token.
    const fetchUser = async () => {
        setAuthState({
          data: null,
          error: null,
          loading: true,
        });

        try {
            const jwt = getCookie("jwt");

            if (!jwt) {
                return setAuthState({
                  data: null,
                  error: null,
                  loading: false,
                });
            }

            // Fetch the user data.
            const response = await axios.get("/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            // Set Axios authorization headers.
            axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

            // Set the auth state with the fetched user data.
            setAuthState({
                data: response.data,
                error: null,
                loading: false,
            });

        } catch (error: any) {
            // Handle any errors that occurred during the try block.
            setAuthState({
                data: null,
                error: error.response.data.errorMessage,
                loading: false,
            });
        }
    };

    // Call fetchUser when the component is mounted.
    useEffect(() => {
        fetchUser();
    }, []);

    // Return the AuthenticationContext.Provider.
    return (
        <AuthenticationContext.Provider value={{
            ...authState,
            setAuthState
        }}>
            {children}
        </AuthenticationContext.Provider>
    );
}

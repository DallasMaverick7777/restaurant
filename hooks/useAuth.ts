import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthenticationContext } from "../app/context/AuthContext";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

const useAuth = () => {

    const { setAuthState } = useContext(AuthenticationContext);

    const setAxiosAuthHeaders = () => {
        const token = getCookie("jwt");
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    useEffect(() => {
        const token = getCookie("jwt");
        if (token) {
            setAuthState({
                data: null,
                error: null,
                loading: false
            });
            setAxiosAuthHeaders();
        }
    }, []);

    const signin = async ({ email, password }: { email: string; password: string }, handleClose: () => void) => {
        setAuthState({
            data: null,
            error: null,
            loading: true
        });
        try {
            const response = await axios.post("/api/auth/signin", {
                email,
                password
            });

            const token = response.data.token;
            setCookie("jwt", token);

            setAuthState({
                data: response.data,
                error: null,
                loading: false,
            });

            setAxiosAuthHeaders();
            handleClose();
        } catch (error: any) {
            setAuthState({
                data: null,
                error: error.response.data.errorMessage,
                loading: false
            });
        }
    };

    const signup = async ({ email, password, firstName, lastName, city, phone }: { email: string; password: string; firstName: string; lastName: string; city: string; phone: string }, handleClose: () => void) => {
        setAuthState({
            data: null,
            error: null,
            loading: true
        });
        try {
            const response = await axios.post("/api/auth/signup", {
                email,
                password,
                firstName,
                lastName,
                city,
                phone
            });

            setAuthState({
                data: response.data,
                error: null,
                loading: false,
            });
            handleClose();
        } catch (error: any) {
            setAuthState({
                data: null,
                error: error.response.data.errorMessage,
                loading: false,
            });
        }
    };

    const signout = () => {
        deleteCookie("jwt");

        setAuthState({
            data: null,
            error: null,
            loading: false,
        });
    };

    return {
        signin,
        signup,
        signout,
    };
};

export default useAuth;

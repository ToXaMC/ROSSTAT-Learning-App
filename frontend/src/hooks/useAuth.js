import React, { createContext, useState, useContext } from 'react';
import API from '../api';

const authContext = createContext();

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function useAuth() {
    const [isAuth, setIsAuth] = useState(false);

    return {
        isAuth,
        async login(email, password) {
            const authData = {
                "email": email,
                "password": password
            }
            const result = await API.post(`/signin`, authData);
            if (result.status === 200) {
                return new Promise((res) => {
                    localStorage.setItem('access_token', result.data.access_token);
                    localStorage.setItem('role', parseJwt(result.data.access_token).role);
                    setIsAuth(true);
                    res();
                });
            }
        },
        logout() {
            return new Promise((res) => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('role');
                setIsAuth(false);
                res();
            });
        },
    };
}

export function AuthProvider({ children }) {
    const isAuth = useAuth();

    return <authContext.Provider value={isAuth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
    return useContext(authContext);
}

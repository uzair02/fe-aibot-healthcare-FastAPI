import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
        setLoading(false);

        const handleBeforeUnload = () => {
            localStorage.removeItem('token');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const login = async (username, password, role) => {
        try {
            const response = await axios.post('https://2531ddf8-f3e5-48a3-a856-0a19af7340eb-00-1zhft004frkyw.sisko.replit.dev/login', {
                username,
                password,
                role,
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            setUser({ token: access_token });
        } catch (error) {
            if (error.response) {
                console.error('Login failed:', error.response.data);
            } else {
                console.error('Login failed:', error);
            }
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
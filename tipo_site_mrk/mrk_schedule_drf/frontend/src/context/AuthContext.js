import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            // Получаем информацию о пользователе
            const fetchUser = async () => {
                try {
                    const response = await api.get('/users/me/');
                    setUser({
                        username: response.data.username,
                        is_staff: response.data.is_staff
                    });
                } catch (err) {
                    localStorage.clear();
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    // В AuthContext.js в функции login
const login = async (username, password) => {
    try {
        const response = await api.post('/token/', { username, password });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        // ВРЕМЕННО: считаем что пользователь admin - это админ
        const isStaff = username === 'admin';
        setUser({ username, is_staff: isStaff });

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Неверный логин или пароль' };
    }
};

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
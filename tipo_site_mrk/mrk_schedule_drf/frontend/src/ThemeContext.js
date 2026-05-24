import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    const themes = {
        light: {
            name: 'Светлая',
            icon: '☀️',
        },
        dark: {
            name: 'Тёмная',
            icon: '🌙',
        },
        forest: {
            name: 'Лесная',
            icon: '🌲',
        },
        ocean: {
            name: 'Океан',
            icon: '🌊',
        },
        sunset: {
            name: 'Закат',
            icon: '🌅',
        },
        matrix: {
            name: 'Матрица',
            icon: '💚',
        }
    };

    useEffect(() => {
        localStorage.setItem('theme', theme);

        // Удаляем все старые классы темы
        const body = document.body;
        const oldThemes = ['theme-light', 'theme-dark', 'theme-forest', 'theme-ocean', 'theme-sunset', 'theme-matrix'];
        oldThemes.forEach(themeClass => {
            body.classList.remove(themeClass);
        });

        // Добавляем новую тему
        body.classList.add(`theme-${theme}`);

    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};ммю
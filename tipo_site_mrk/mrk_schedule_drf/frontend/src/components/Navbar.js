import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../ThemeContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, setTheme, themes } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container fluid>
                <BootstrapNavbar.Brand as={Link} to="/">
                    🎓 МРК Расписание
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    {user && (
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/teachers">Преподаватели</Nav.Link>
                            <Nav.Link as={Link} to="/subjects">Предметы</Nav.Link>
                            <Nav.Link as={Link} to="/groups">Группы</Nav.Link>
                            {user?.is_staff && (
                                <Nav.Link as={Link} to="/schedule/add">+ Добавить занятие</Nav.Link>
                            )}
                        </Nav>
                    )}
                    <Nav>
                        {/* Выбор темы */}
                        <Dropdown align="end" className="me-3">
                            <Dropdown.Toggle variant="outline-light" id="dropdown-themes">
                                {themes[theme].icon} {themes[theme].name}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {Object.entries(themes).map(([key, value]) => (
                                    <Dropdown.Item
                                        key={key}
                                        onClick={() => setTheme(key)}
                                        active={theme === key}
                                    >
                                        {value.icon} {value.name}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        {user ? (
                            <Button variant="outline-light" onClick={handleLogout}>
                                Выйти ({user.username})
                            </Button>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Вход</Nav.Link>
                                <Nav.Link as={Link} to="/register">Регистрация</Nav.Link>
                            </>
                        )}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;
import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Простая имитация регистрации
        setTimeout(() => {
            setSuccess('Регистрация успешна! Теперь вы можете войти');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            setLoading(false);
        }, 1000);
    };

    return (
        <Card className="shadow-sm" style={{ maxWidth: '400px', margin: '50px auto' }}>
            <Card.Body>
                <h3 className="text-center mb-4">Регистрация</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Логин</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </Button>
                </Form>
                <div className="text-center mt-3">
                    <Link to="/login">Уже есть аккаунт? Войдите</Link>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Register;
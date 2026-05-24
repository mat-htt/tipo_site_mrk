import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const ScheduleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [groups, setGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({
        group: '',
        subject: '',
        teacher: '',
        day_of_week: 'Пн',
        time: '09:00:00'
    });

    const daysOfWeek = [
        { value: 'Пн', label: 'Понедельник' },
        { value: 'Вт', label: 'Вторник' },
        { value: 'Ср', label: 'Среда' },
        { value: 'Чт', label: 'Четверг' },
        { value: 'Пт', label: 'Пятница' },
        { value: 'Сб', label: 'Суббота' }
    ];

    useEffect(() => {
        loadSelectData();
        if (id) {
            loadSchedule();
        }
    }, [id]);

    const loadSelectData = async () => {
        try {
            const [groupsRes, subjectsRes, teachersRes] = await Promise.all([
                api.get('/groups/'),
                api.get('/subjects/'),
                api.get('/teachers/')
            ]);
            setGroups(groupsRes.data);
            setSubjects(subjectsRes.data);
            setTeachers(teachersRes.data);
        } catch (err) {
            setError('Ошибка загрузки данных');
        }
    };

    const loadSchedule = async () => {
        try {
            const response = await api.get(`/schedule/${id}/`);
            setFormData({
                group: response.data.group,
                subject: response.data.subject,
                teacher: response.data.teacher,
                day_of_week: response.data.day_of_week,
                time: response.data.time
            });
        } catch (err) {
            setError('Ошибка загрузки записи');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (id) {
                await api.put(`/schedule/${id}/`, formData);
            } else {
                await api.post('/schedule/', formData);
            }
            navigate('/');
        } catch (err) {
            setError('Ошибка сохранения записи');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Card.Body>
                <h3 className="mb-4">{id ? '✏️ Редактирование' : '➕ Добавление'} занятия</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Группа</Form.Label>
                        <Form.Select
                            name="group"
                            value={formData.group}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите группу</option>
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Предмет</Form.Label>
                        <Form.Select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите предмет</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.title}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Преподаватель</Form.Label>
                        <Form.Select
                            name="teacher"
                            value={formData.teacher}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите преподавателя</option>
                            {teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>День недели</Form.Label>
                        <Form.Select
                            name="day_of_week"
                            value={formData.day_of_week}
                            onChange={handleChange}
                            required
                        >
                            {daysOfWeek.map(day => (
                                <option key={day.value} value={day.value}>
                                    {day.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Время</Form.Label>
                        <Form.Control
                            type="time"
                            name="time"
                            value={formData.time.slice(0, 5)}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <div className="d-flex gap-2">
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Сохранение...' : '💾 Сохранить'}
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/')}>
                            Отмена
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ScheduleForm;
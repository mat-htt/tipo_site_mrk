import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ScheduleTable = () => {
    const [schedules, setSchedules] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const daysOrder = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const daysMap = {
        'Пн': 'Понедельник',
        'Вт': 'Вторник',
        'Ср': 'Среда',
        'Чт': 'Четверг',
        'Пт': 'Пятница',
        'Сб': 'Суббота'
    };

    useEffect(() => {
        loadGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            loadSchedules();
        }
    }, [selectedGroup]);

    const loadGroups = async () => {
        try {
            const response = await api.get('/groups/');
            setGroups(response.data);
            if (response.data.length > 0 && !selectedGroup) {
                setSelectedGroup(response.data[0].id);
            }
            setLoading(false);
        } catch (err) {
            setError('Ошибка загрузки групп');
            setLoading(false);
        }
    };

    const loadSchedules = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/schedule/?group=${selectedGroup}`);
            setSchedules(response.data);
            setError(null);
        } catch (err) {
            setError('Ошибка загрузки расписания');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить это занятие?')) {
            try {
                await api.delete(`/schedule/${id}/`);
                loadSchedules();
            } catch (err) {
                alert('Ошибка удаления');
            }
        }
    };

    const getScheduleByDay = (day) => {
        return schedules
            .filter(s => s.day_of_week === day)
            .sort((a, b) => a.time.localeCompare(b.time));
    };

    if (loading && groups.length === 0) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    return (
        <Card>
            <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">📅 Расписание занятий</h4>
                    {user?.is_staff && (
                        <Button variant="success" onClick={() => navigate('/schedule/add')}>
                            + Добавить занятие
                        </Button>
                    )}
                </div>
            </Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <div className="mb-3">
                    <Form.Select
                        style={{ width: '250px' }}
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                    >
                        {groups.map(group => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </Form.Select>
                </div>

                {loading ? (
                    <div className="text-center py-5"><Spinner animation="border" /></div>
                ) : schedules.length === 0 ? (
                    <Alert variant="info">Нет занятий для этой группы</Alert>
                ) : (
                    daysOrder.map(day => {
                        const daySchedules = getScheduleByDay(day);
                        if (daySchedules.length === 0) return null;

                        return (
                            <div key={day} className="mb-4">
                                <h5 className="mb-2">{daysMap[day]}</h5>
                                <Table hover responsive>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '100px' }}>Время</th>
                                            <th>Предмет</th>
                                            <th>Преподаватель</th>
                                            {user?.is_staff && <th style={{ width: '80px' }}>Действия</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {daySchedules.map(schedule => (
                                            <tr key={schedule.id}>
                                                <td>{schedule.time.slice(0, 5)}</td>
                                                <td><strong>{schedule.subject_title}</strong></td>
                                                <td>{schedule.teacher_name}</td>
                                                {user?.is_staff && (
                                                    <td>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            className="me-1"
                                                            onClick={() => navigate(`/schedule/edit/${schedule.id}`)}
                                                        >
                                                            ✏️
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleDelete(schedule.id)}
                                                        >
                                                            🗑️
                                                        </Button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        );
                    })
                )}
            </Card.Body>
        </Card>
    );
};

export default ScheduleTable;
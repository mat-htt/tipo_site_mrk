import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const TeacherList = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        loadTeachers();
    }, []);

    const loadTeachers = async () => {
        try {
            const response = await api.get('/teachers/');
            setTeachers(response.data);
        } catch (err) {
            setError('Ошибка загрузки преподавателей');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (teacher = null) => {
        if (teacher) {
            setEditingTeacher(teacher);
            setFormData({ name: teacher.name });
        } else {
            setEditingTeacher(null);
            setFormData({ name: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTeacher(null);
        setFormData({ name: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTeacher) {
                await api.put(`/teachers/${editingTeacher.id}/`, formData);
            } else {
                await api.post('/teachers/', formData);
            }
            loadTeachers();
            handleCloseModal();
        } catch (err) {
            setError('Ошибка сохранения');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/teachers/${id}/`);
            loadTeachers();
            setDeleteConfirm(null);
        } catch (err) {
            setError('Ошибка удаления');
        }
    };

    if (loading) return <div className="text-center"><Spinner animation="border" /></div>;

    return (
        <>
            <Card className="shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">👨‍🏫 Преподаватели</h4>
                    {user?.is_staff && (
                        <Button variant="success" size="sm" onClick={() => handleOpenModal()}>
                            + Добавить
                        </Button>
                    )}
                </Card.Header>
                <ListGroup variant="flush">
                    {teachers.length === 0 ? (
                        <ListGroup.Item className="text-muted">Нет преподавателей</ListGroup.Item>
                    ) : (
                        teachers.map(teacher => (
                            <ListGroup.Item key={teacher.id} className="d-flex justify-content-between align-items-center">
                                <strong>{teacher.name}</strong>
                                {user?.is_staff && (
                                    <div>
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(teacher)}>
                                            ✏️
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => setDeleteConfirm(teacher)}>
                                            🗑️
                                        </Button>
                                    </div>
                                )}
                            </ListGroup.Item>
                        ))
                    )}
                </ListGroup>
            </Card>

            {/* Модальное окно для добавления/редактирования */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingTeacher ? 'Редактировать' : 'Добавить'} преподавателя</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>ФИО преподавателя</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ name: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Отмена</Button>
                        <Button variant="primary" type="submit">Сохранить</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Модальное окно подтверждения удаления */}
            <Modal show={deleteConfirm !== null} onHide={() => setDeleteConfirm(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение удаления</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Удалить преподавателя <strong>{deleteConfirm?.name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Отмена</Button>
                    <Button variant="danger" onClick={() => handleDelete(deleteConfirm.id)}>Удалить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TeacherList;
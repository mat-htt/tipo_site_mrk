import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SubjectList = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [formData, setFormData] = useState({ title: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            const response = await api.get('/subjects/');
            setSubjects(response.data);
        } catch (err) {
            setError('Ошибка загрузки предметов');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (subject = null) => {
        if (subject) {
            setEditingSubject(subject);
            setFormData({ title: subject.title });
        } else {
            setEditingSubject(null);
            setFormData({ title: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingSubject(null);
        setFormData({ title: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSubject) {
                await api.put(`/subjects/${editingSubject.id}/`, formData);
            } else {
                await api.post('/subjects/', formData);
            }
            loadSubjects();
            handleCloseModal();
        } catch (err) {
            setError('Ошибка сохранения');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/subjects/${id}/`);
            loadSubjects();
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
                    <h4 className="mb-0">📚 Предметы</h4>
                    {user?.is_staff && (
                        <Button variant="success" size="sm" onClick={() => handleOpenModal()}>
                            + Добавить
                        </Button>
                    )}
                </Card.Header>
                <ListGroup variant="flush">
                    {subjects.length === 0 ? (
                        <ListGroup.Item className="text-muted">Нет предметов</ListGroup.Item>
                    ) : (
                        subjects.map(subject => (
                            <ListGroup.Item key={subject.id} className="d-flex justify-content-between align-items-center">
                                <strong>{subject.title}</strong>
                                {user?.is_staff && (
                                    <div>
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(subject)}>
                                            ✏️
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => setDeleteConfirm(subject)}>
                                            🗑️
                                        </Button>
                                    </div>
                                )}
                            </ListGroup.Item>
                        ))
                    )}
                </ListGroup>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingSubject ? 'Редактировать' : 'Добавить'} предмет</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Название предмета</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ title: e.target.value })}
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

            <Modal show={deleteConfirm !== null} onHide={() => setDeleteConfirm(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение удаления</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Удалить предмет <strong>{deleteConfirm?.title}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Отмена</Button>
                    <Button variant="danger" onClick={() => handleDelete(deleteConfirm.id)}>Удалить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SubjectList;
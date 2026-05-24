import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            const response = await api.get('/groups/');
            setGroups(response.data);
        } catch (err) {
            setError('Ошибка загрузки групп');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (group = null) => {
        if (group) {
            setEditingGroup(group);
            setFormData({ name: group.name });
        } else {
            setEditingGroup(null);
            setFormData({ name: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingGroup(null);
        setFormData({ name: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingGroup) {
                await api.put(`/groups/${editingGroup.id}/`, formData);
            } else {
                await api.post('/groups/', formData);
            }
            loadGroups();
            handleCloseModal();
        } catch (err) {
            setError('Ошибка сохранения');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/groups/${id}/`);
            loadGroups();
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
                    <h4 className="mb-0">👥 Группы</h4>
                    {user?.is_staff && (
                        <Button variant="success" size="sm" onClick={() => handleOpenModal()}>
                            + Добавить
                        </Button>
                    )}
                </Card.Header>
                <ListGroup variant="flush">
                    {groups.length === 0 ? (
                        <ListGroup.Item className="text-muted">Нет групп</ListGroup.Item>
                    ) : (
                        groups.map(group => (
                            <ListGroup.Item key={group.id} className="d-flex justify-content-between align-items-center">
                                <strong>{group.name}</strong>
                                {user?.is_staff && (
                                    <div>
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(group)}>
                                            ✏️
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => setDeleteConfirm(group)}>
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
                    <Modal.Title>{editingGroup ? 'Редактировать' : 'Добавить'} группу</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Название группы</Form.Label>
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

            <Modal show={deleteConfirm !== null} onHide={() => setDeleteConfirm(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение удаления</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Удалить группу <strong>{deleteConfirm?.name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Отмена</Button>
                    <Button variant="danger" onClick={() => handleDelete(deleteConfirm.id)}>Удалить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default GroupList;
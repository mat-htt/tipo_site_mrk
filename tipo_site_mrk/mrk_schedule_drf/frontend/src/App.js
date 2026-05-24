import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './ThemeContext';
import Navbar from './components/Navbar';
import ScheduleTable from './components/ScheduleTable';
import ScheduleForm from './components/ScheduleForm';
import TeacherList from './components/TeacherList';
import SubjectList from './components/SubjectList';
import GroupList from './components/GroupList';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Navbar />
                    <div className="container mt-4">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/" element={
                                <PrivateRoute>
                                    <ScheduleTable />
                                </PrivateRoute>
                            } />
                            <Route path="/schedule/add" element={
                                <PrivateRoute adminOnly={true}>
                                    <ScheduleForm />
                                </PrivateRoute>
                            } />
                            <Route path="/schedule/edit/:id" element={
                                <PrivateRoute adminOnly={true}>
                                    <ScheduleForm />
                                </PrivateRoute>
                            } />
                            <Route path="/teachers" element={
                                <PrivateRoute>
                                    <TeacherList />
                                </PrivateRoute>
                            } />
                            <Route path="/subjects" element={
                                <PrivateRoute>
                                    <SubjectList />
                                </PrivateRoute>
                            } />
                            <Route path="/groups" element={
                                <PrivateRoute>
                                    <GroupList />
                                </PrivateRoute>
                            } />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
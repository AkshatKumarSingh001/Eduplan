import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';

const AuthContainer = ({ onLogin }) => {
    const [currentView, setCurrentView] = useState('login');

    const handleNavigate = (view) => {
        setCurrentView(view);
    };

    return (
        <>
            {currentView === 'login' && <Login onLogin={onLogin} onNavigate={handleNavigate} />}
            {currentView === 'signup' && <Signup onNavigate={handleNavigate} />}
            {currentView === 'forgot-password' && <ForgotPassword onNavigate={handleNavigate} />}
        </>
    );
};

export default AuthContainer;

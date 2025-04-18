import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper, Form, Input, Button, Label } from './index.styled.ts';
import { useLoginMutation } from 'services';
import { PATHS } from 'consts';
import  BackgroundScene from './back.tsx'

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login({username, password}).then((result) => {
      localStorage.setItem('token', result.data!.access_token);
      alert('Успешный вход!');
      navigate(PATHS.MAIN);
    }).catch((error) => {
      if (error.status == 401) {
        alert('Неверная связка логин и пароль')
      } else {
              setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate(PATHS.MAIN);
      }, 3000)
      }
    });
  }

  return (
    <PageWrapper>
      <BackgroundScene />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1>Тренажер интервью</h1>
        <Form onSubmit={handleSubmit}>
          <Label htmlFor={username}>Имя пользователя</Label>
          <Input
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
          />
          <Label htmlFor={password}>Пароль</Label>
          <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </Form>
      </div>

      {showModal && (
          <div
              style={{
                position: 'fixed',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#fff',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                zIndex: 1000
              }}
          >
            <h3>Вы успешно зарегистрированы ✅</h3>
            <p>Сейчас вы будете перенаправлены...</p>
          </div>
      )}
    </PageWrapper>
  );
};

export default Login;

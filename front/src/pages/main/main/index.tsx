import React, { useState } from 'react';
import {
  Container,
  Header,
  Title,
  ButtonGroup,
  Button,
  Table,
  Th,
  Td,
} from './main.styles.ts';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'consts';
import CandidateModal from './persona.tsx';

const dummyData = [
  { id: 1, name: 'Иван Иванов', status: 'В процессе', date: '2025-04-17' },
  { id: 2, name: 'Мария Петрова', status: 'Завершено', date: '2025-04-16' },
  { id: 3, name: 'Анна Смирнова', status: 'Оценка', date: '2025-04-15' },
];

const Main: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <Container>
      <Header>
        <Title>Список интервью</Title>
        <ButtonGroup>
          <Button onClick={() => setShowModal(true)}>Начать новое</Button>
          <Button $variant="green" onClick={() => navigate(PATHS.EVALUATE)}>
            Провести оценку
          </Button>
        </ButtonGroup>
      </Header>

      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Имя</Th>
            <Th>Статус</Th>
            <Th>Дата</Th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((item) => (
            <tr key={item.id}>
              <Td>{item.id}</Td>
              <Td>{item.name}</Td>
              <Td>{item.status}</Td>
              <Td>{item.date}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && <CandidateModal onClose={() => setShowModal(false)} />}
    </Container>
  );
};

export default Main;

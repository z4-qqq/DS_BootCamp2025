import styled from 'styled-components';

export const Container = styled.div`
  padding: 24px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

export const Button = styled.button<{ $variant?: 'green' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: ${(props) =>
    props.$variant === 'green' ? '#22c55e' : '#3b82f6'};
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.$variant === 'green' ? '#16a34a' : '#2563eb'};
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
`;

export const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

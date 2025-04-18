import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

export const ModalContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const Label = styled.label`
  font-weight: 500;
  margin-bottom: 0.25rem;
  display: block;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border-radius: 6px;
  border: 2px solid rgba(254, 230, 0, 0.5);
  width: 100%;
`;

export const Select = styled.select`
  padding: 0.75rem;
  border-radius: 6px;
  border: 2px solid rgba(254, 230, 0, 0.5);
  width: 100%;
`;

export const Textarea = styled.textarea`
  padding: 0.75rem;
  border-radius: 6px;
  border: 2px solid rgba(254, 230, 0, 0.5);
  width: 100%;
`;

export const Button = styled.button`
  padding: 0.75rem 1rem;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  background: rgb(254, 230, 0);
  color: black;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

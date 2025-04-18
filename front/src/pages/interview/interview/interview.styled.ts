import styled from 'styled-components';

export const ChatWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f6f6f6;
  padding: 2rem;
`;

export const ChatBox = styled.div`
  width: 80%;
  max-width: 1000px;
  background: #fff;
  border-radius: 8px;
  border-left: 6px solid rgba(254, 230, 0, 1);
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const MessageList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
  border-radius: 6px;
  background: #f9f9f9;
  border: 2px solid rgba(0, 0, 0, 0.05);
`;

export const Message = styled.div`
  margin-bottom: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 6px;
  font-size: 0.95rem;
  color: #333;
`;

export const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`;

export const MessageInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid rgba(254, 230, 0, 0.5);
  border-radius: 6px;
  background: #fff;
  color: #000;

  &:focus {
    outline: none;
    border-color: rgba(254, 230, 0, 1);
    box-shadow: 0 0 0 2px rgba(254, 230, 0, 0.3);
  }
`;

export const SendButton = styled.button`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  background: rgb(254, 230, 0);
  color: black;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }
`;

import styled from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f6f6f6;
  background-image: url("data:image/svg+xml,%3Csvg width='500' height='500' viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23eaeaea' fill-opacity='0.3'%3E%3Ccircle cx='70' cy='70' r='50'/%3E%3Crect x='200' y='100' width='120' height='70' rx='10'/%3E%3Cpath d='M100 300c0-20 20-30 30-20l20 20c10 10 10 30-10 30s-40-10-40-30z' /%3E%3Crect x='350' y='250' width='100' height='50' rx='10'/%3E%3Ccircle cx='420' cy='130' r='30' /%3E%3C/g%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
    position: relative;
    overflow: hidden;
    color: #000;
`;

export const Form = styled.form`
  border-radius: 4px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 50vb;
  padding: 40px 10px;
  border-top: 4px solid rgba(254, 230, 0, 1); /* желтая линия сверху */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* лёгкая тень */
`;

export const Label = styled.label`
  align-self: flex-start;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-left: 15%;
`;

export const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid rgba(254, 230, 0, 0.5); /* жёлтая обводка с прозрачностью */
  border-radius: 6px;
  background: #ffffff;
  width: 70%;
  color: black;

  &:focus {
    outline: none;
    border-color: rgba(254, 230, 0, 1); /* при фокусе делаем насыщенную */
    box-shadow: 0 0 0 2px rgba(254, 230, 0, 0.3);
  }
`;

export const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
    width: 70%;
  background: rgb(254, 230, 0);
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export const ErrorText = styled.div`
  color: rgb(254, 100, 100);
  font-size: 0.875rem;
  text-align: center;
`;

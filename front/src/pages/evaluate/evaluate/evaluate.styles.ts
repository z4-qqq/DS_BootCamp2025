import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 60px;
  height: 100vh;
  background-color: #fefefe;
  background-image: radial-gradient(circle at 20% 30%, #fceabb 0%, #f6f6f6 100%);
  color: #000;
`;

export const Form = styled.form`
  border-radius: 6px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  width: 60vb;
  padding: 40px 20px;
  border-left: 6px solid rgba(254, 230, 0, 1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
`;

export const Label = styled.label`
  align-self: flex-start;
  font-size: 0.9rem;
  font-weight: 500;
  color: #444;
  margin-left: 5%;
`;

export const Button = styled.button`
  padding: 0.75rem;
  width: 90%;
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

export const Breadcrumbs = styled.div`
  width: 100%;
  max-width: 60vb;
  margin-bottom: 20px;
  padding-left: 10px;
  font-size: 0.9rem;
  color: #666;
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const CrumbLink = styled(Link)`
  color: #007acc;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const CrumbDivider = styled.span`
  color: #aaa;
`;
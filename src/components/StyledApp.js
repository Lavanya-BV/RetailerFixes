// src/components/StyledApp.js
import styled from 'styled-components';

export const AppContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

export const Table = styled.table`
  width: 80%;
  margin: 20px auto;
  border-collapse: collapse;
`;

export const Th = styled.th`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
  background-color: #f4f4f4;
`;

export const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
`;

export const Tr = styled.tr`
  &:hover {
    background-color: #f9f9f9;
    cursor: pointer;
  }
`;

export const Select = styled.select`
  padding: 5px;
  margin: 10px;
`;

export const Button = styled.button`
  padding: 8px 16px;
  margin: 5px;
  background: #f4f4f4;
  border: 1px solid #ddd;
  cursor: pointer;
  &:disabled {
    background: #eee;
    cursor: not-allowed;
  }
`;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageWrapper,
  Form,
  Button,
  Label,
  Breadcrumbs,
  CrumbLink,
  CrumbDivider,
} from './evaluate.styles.ts';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

const JsonUploadPage: React.FC = () => {
  const [jsonValue, setJsonValue] = useState('{}');
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result?.toString() ?? '';
        const parsed = JSON.parse(content);
        setJsonValue(JSON.stringify(parsed, null, 2));
      } catch (err) {
        alert('Файл не является валидным JSON');
      }
    };

    reader.readAsText(file);
  };

  return (
    <PageWrapper>
      <Breadcrumbs>
        <CrumbLink to="/">Главная</CrumbLink>
        <CrumbDivider>/</CrumbDivider>
        <span>Оценка интервью</span>
      </Breadcrumbs>

      <h1>Оценка JSON-интервью</h1>
      <Form>
        <Label htmlFor="json-editor">JSON</Label>
        <div style={{ width: '90%', minHeight: '300px' }}>
          <CodeMirror
            value={jsonValue}
            height="300px"
            extensions={[json()]}
            onChange={(value) => setJsonValue(value)}
          />
        </div>

        <Label htmlFor="json-file">Загрузить JSON-файл</Label>
        <input
          type="file"
          accept=".json,application/json"
          onChange={handleFileUpload}
          style={{ marginBottom: '1rem' }}
        />

        <Button type="button" onClick={() => console.log('Отправка:', jsonValue)}>
          Оценить
        </Button>
      </Form>
    </PageWrapper>
  );
};

export default JsonUploadPage;

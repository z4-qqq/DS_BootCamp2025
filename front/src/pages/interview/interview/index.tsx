import React, { useEffect, useRef, useState } from 'react';
import {
  ChatWrapper,
  ChatBox,
  MessageList,
  Message,
  InputRow,
  MessageInput,
  SendButton
} from './interview.styled';
import { useSearchParams } from 'react-router-dom';
import { useGetHintMutation, useFeedbackEvaluationMutation, useEvaluateMutation } from 'services';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [searchParams] = useSearchParams();

  const persona = searchParams.get('persona') || 'unknown';
  const skill = searchParams.get('skill') || 'unknown';

  const [getHint] = useGetHintMutation();
  const [evaluate] = useEvaluateMutation();
  const [feedbackEval] = useFeedbackEvaluationMutation();


  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = 'localhost:8000';
    const ws = new WebSocket(
      `${protocol}://${host}/ws/interview?persona=${encodeURIComponent(
        persona
      )}&skill=${encodeURIComponent(skill)}`
    );

    socketRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'voice' && data.audio) playAudio(data.audio);
        if (data.content) {
          setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
        }
      } catch {
        console.error('Ошибка при разборе ответа');
      } finally {
        setIsWaiting(false);
      }
    };

    return () => {
      ws.close();
    };
  }, [persona, skill]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    setMessages((prev) => [...prev, { role: 'user', content: input.trim() }]);
    socketRef.current.send(JSON.stringify({ type: 'text', message: input.trim() }));
    setInput('');
    setIsWaiting(true);
  };

  const playAudio = (base64: string) => {
    const audio = new Audio(`data:audio/mp3;base64,${base64}`);
    audio.play();
  };

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
        recorder.onstop = () => processAudio();

        recorder.start();
        setIsRecording(true);
      } catch {
        alert('Ошибка доступа к микрофону');
      }
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    setIsWaiting(true);
  };

  const processAudio = () => {
    const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64 = reader.result?.toString().split(',')[1];
      if (base64 && socketRef.current) {
        socketRef.current.send(
          JSON.stringify({ type: 'audio', audio: base64, format: 'webm' })
        );
      }
    };
  };

  const requestHint = () => {
    getHint({ persona, skill, messages });
  };

  const endInterview = () => {
    alert('Интервью завершено и отправлено на оценку.');
  };

  return (
    <ChatWrapper>
      <ChatBox>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Профиль:</strong> {persona} <br />
          <strong>Навык:</strong> {skill}
        </div>
        <MessageList>
          {messages.map((msg, idx) => (
            <Message
              key={idx}
              style={{
                textAlign: msg.role === 'user' ? 'right' : 'left',
                backgroundColor: msg.role === 'user' ? 'rgba(144, 238, 144, 0.2)' : 'rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '6px',
                padding: '0.5rem 0.75rem',
                marginBottom: '0.5rem'
              }}
            >
              {msg.content}
            </Message>
          ))}
        </MessageList>

        <InputRow>
          <MessageInput
            type="text"
            value={input}
            placeholder="Введите сообщение"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isWaiting}
          />
          <SendButton onClick={sendMessage} disabled={isWaiting}>
            Отправить
          </SendButton>
        </InputRow>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <SendButton onClick={toggleRecording}>
            {isRecording ? 'Остановить запись' : 'Записать голос'}
          </SendButton>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <SendButton onClick={requestHint}>Подсказка</SendButton>
          <SendButton onClick={endInterview}>Завершить интервью</SendButton>
        </div>
      </ChatBox>
    </ChatWrapper>
  );
};

export default Chat;

import React, { useState, useEffect } from 'react';
import {
  Overlay,
  ModalContainer,
  Title,
  Form,
  Input,
  Label,
  Button,
  Select,
  Textarea,
  ButtonRow,
} from './persona.styles.ts';

const skillData: Record<string, string[]> = {
  Я: [
    'Сохраняет самообладание',
    'Проявляет выносливость',
    'Работает энергично',
    'Адаптируется к изменениям',
    'В ситуации неопределённости — действует',
    'Проявляет инициативу',
    'Верит в лучший исход',
    'Самосовершенствуется',
    'Поощряет обратную связь в свой адрес',
    'Конкурирует',
    'Транслирует уверенность в себе',
  ],
  Люди: [
    'Мотивирует других',
    'Создаёт и укрепляет команду',
    'Занимает лидирующую позицию',
    'Даёт сотрудникам возможности для развития',
    'Понимает людей',
    'Поддерживает других людей',
    'Работает в команде',
    'Поддерживает широкий круг общения',
    'Проявляет социальную смелость',
    'Ценит разнообразие людей и взглядов',
    'Управляет конфликтами',
    'Влияет на других людей',
    'Ведёт переговоры',
    'Выступает на публике',
    'Ясно излагает мысли',
    'Производит впечатление на людей',
    'Учитывает интересы стейкхолдеров и клиентов',
    'Говорит про изменения',
  ],
  Задачи: [
    'Организует работу других',
    'Планирует работу',
    'Следует плану',
    'Преследует цели',
    'Выбирает амбициозные цели',
    'Добивается высокого качества',
    'Принимает решение действовать',
    'Поддерживает социальные и этические нормы',
    'Поддерживает правила и процедуры',
    'Внедряет и использует цифровые инструменты',
  ],
  Мышление: [
    'Ищет и использует новые знания',
    'Мыслят нестандартно',
    'Мыслят практически',
    'Мыслят предпринимательски',
    'Ищет информацию',
    'Опираться на достоверную информацию',
    'Анализирует информацию',
    'Мыслят стратегически',
    'Рассматривает альтернативы',
    'Мыслят абстрактно',
  ],
};

interface CandidateModalProps {
  onClose: () => void;
}

const CandidateModal: React.FC<CandidateModalProps> = ({ onClose }) => {
  const [profile, setProfile] = useState('');
  const [mode, setMode] = useState<'select' | 'describe'>('select');
  const [category, setCategory] = useState('');
  const [skill, setSkill] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSkill = mode === 'describe' ? description.trim() : skill.trim();
    if (!profile || !finalSkill) {
      alert('Пожалуйста, заполните оба поля');
      return;
    }

    window.location.href = `/interview?persona=${encodeURIComponent(
      profile
    )}&skill=${encodeURIComponent(finalSkill)}`;
  };

  return (
    <Overlay>
      <ModalContainer>
        <Title>Опишите профиль кандидата</Title>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="persona">Профиль:</Label>
            <Input
              id="persona"
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Навык, который требуется оценить:</Label>
            <ButtonRow>
              <Button type="button" onClick={() => setMode('select')}>
                Выбрать
              </Button>
              <Button type="button" onClick={() => setMode('describe')}>
                Описать
              </Button>
            </ButtonRow>

            {mode === 'select' && (
              <>
                <Select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSkill('');
                  }}
                >
                  <option value="">Выберите категорию</option>
                  {Object.keys(skillData).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>

                {category && (
                  <Select value={skill} onChange={(e) => setSkill(e.target.value)}>
                    <option value="">Выберите навык</option>
                    {skillData[category]!.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                )}
              </>
            )}

            {mode === 'describe' && (
              <Textarea
                rows={4}
                placeholder="Опишите навык..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            )}
          </div>

          <Button type="submit">Перейти к интервью</Button>
        </Form>
      </ModalContainer>
    </Overlay>
  );
};

export default CandidateModal;

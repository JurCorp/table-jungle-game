import React, { useState } from 'react';

const questions = [
  {
    question: 'Какая формула считает сумму?',
    answers: ['ЕСЛИ', 'СУММ', 'ВПР'],
    correct: 1,
  },
  {
    question: 'Какая функция ищет значение по условию?',
    answers: ['СЧЁТЕСЛИ', 'ПРОСМОТР', 'СРЗНАЧ'],
    correct: 0,
  },
  {
    question: 'Что лучше: ВПР или ПРОСМОТРX?',
    answers: ['ВПР — классика', 'ПРОСМОТРХ — будущее', 'Зависит от задачи'],
    correct: 1,
  },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  const current = questions[step];

  const onAnswer = (index) => {
    if (index === current.correct) {
      setScore(score + 1);
    }
    const nextStep = step + 1;
    if (nextStep < questions.length) {
      setStep(nextStep);
    } else {
      setStep('end');
    }
  };

  if (step === 'end') {
    return (
      <div className="app">
        <h1>Финал</h1>
        <p>Ты набрал {score} из {questions.length} баллов.</p>
        <p>Валерий Георгиевич: "Берите его!"</p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Вопрос {step + 1}</h1>
      <p>{current.question}</p>
      <ul>
        {current.answers.map((text, idx) => (
          <li key={idx}>
            <button onClick={() => onAnswer(idx)}>{text}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

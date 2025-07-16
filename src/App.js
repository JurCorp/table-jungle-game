import React, { useState } from "react";

const App = () => {
  const [step, setStep] = useState("rewind"); // rew, wake, break, resume, vacancy, letter, intro, name, quiz, end
  const [username, setUsername] = useState("");
  const [mood, setMood] = useState("good");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [ariResponse, setAriResponse] = useState("");

  const questions = [
    {
    question: "Какой синтаксис у функции СУММ в Excel?",
    options: [
      "=SUMM(A1:A5)",
      "=СУММ(A1:A5)",
      "=TOTAL(A1:A5)",
      "=СУМА(A1:A5)"
    ],
    correct: "=СУММ(A1:A5)",
    topic: "Формулы"
  },
  {
    question: "Что делает функция СРЗНАЧ?",
    options: [
      "Считает сумму значений",
      "Определяет максимальное значение",
      "Считает среднее арифметическое",
      "Форматирует ячейки"
    ],
    correct: "Считает среднее арифметическое",
    topic: "Формулы"
  },
  {
    question: "Какая формула вернёт наибольшее значение в диапазоне?",
    options: [
      "=MIN(A1:A5)",
      "=СРЗНАЧ(A1:A5)",
      "=MAX(A1:A5)",
      "=IF(A1>A2,A1,A2)"
    ],
    correct: "=MAX(A1:A5)",
    topic: "Формулы"
  },
  {
    question: "Как задать числовой формат с двумя знаками после запятой?",
    options: [
      "Формат ячеек > Числовой > Два знака после запятой",
      "Применить формулу ОКРУГЛ",
      "Поставить точку вручную",
      "Невозможно задать"
    ],
    correct: "Формат ячеек > Числовой > Два знака после запятой",
    topic: "Форматирование"
  },
  {
    question: "Что выбрать вместо ВПР в Excel 365?",
    options: [
      "=XLOOKUP(...) / =ПРОСМОТРХ(...)",
      "=Индекс + Поиск",
      "=ГПР",
      "=ФИЛЬТР"
    ],
    correct: "=XLOOKUP(...) / =ПРОСМОТРХ(...)",
    topic: "Поиск"
  },
  ];

  const ariPhrases = {
    good: {
      correct: [
        "Отлично! Я вижу, ты не зря окончил Юрский университет.",
        "Так держать! У нас любят динозавров, которые думают.",
        "Впечатляюще",
      ],
      incorrect: [
        "Ошибся, бывает. Главное — делать выводы!",
        "Ничего страшного. Мы учимся на ошибках.",
        "Я тоже не с первого раза понял Excel.",
      ],
    },
    bad: {
      correct: [
        "Ну наконец-то что-то правильное.",
        "Ты это сам сделал, или кто-то подсказал?",
        "Случайно правильно нажал?",
      ],
      incorrect: [
        "Вот так и знал, что ты не тянешь.",
        "Это даже не смешно.",
        "Как ты вообще сюда попал?",
      ],
    },
  };

  const getAriResponse = (isCorrect) => {
    const phrases = ariPhrases[mood][isCorrect ? "correct" : "incorrect"];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  const handleAnswer = (option) => {
    if (selected) return;
    setSelected(option);
    const current = questions[questionIndex];
    const isCorrect = option === current.correct;
    if (isCorrect) setScore((prev) => prev + 1);
    setAriResponse(getAriResponse(isCorrect));
    if (!isCorrect && Math.random() < 0.4) setMood("bad");
    setTimeout(() => {
      setSelected(null);
      setAriResponse("");
      if (questionIndex + 1 >= questions.length) {
        setStep("end");
      } else {
        setQuestionIndex((prev) => prev + 1);
      }
    }, 2500);
  };

  // 0. Вступление: перемотка времени
  if (step === "rewind") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Когда всё началось…</h1>
        <img src="https://placehold.co/600x300?text=Rewind+Animation" alt="rewind" className="mx-auto mb-4" />
        <button className="bg-black text-white p-2 rounded" onClick={() => setStep("wake")}>
          Проснуться
        </button>
      </div>
    );
  }

  // 1. Кирилл просыпается
  if (step === "wake") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Будильник орёт. Кирилл открывает глаза...</h2>
        <img src="/room.jpg" alt="wake" className="mx-auto mb-4" />
        <button className="bg-yellow-300 hover:bg-yellow-400 p-2 rounded" onClick={() => setStep("breakfast")}>
          Встать и пойти на кухню
        </button>
      </div>
    );
  }

  // 2. Завтрак
  if (step === "breakfast") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl mb-2">На кухне — каша из папоротников. Кирилл завтракает в тишине.</h2>
        <img src="https://placehold.co/600x300?text=Завтрак+динозавра" alt="breakfast" className="mx-auto mb-4" />
        <button className="bg-yellow-300 hover:bg-yellow-400 p-2 rounded" onClick={() => setStep("resume")}>
          Пора составить резюме
        </button>
      </div>
    );
  }

  // 3. Резюме (ввод имени)
  if (step === "resume") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl mb-4">Кирилл открывает Excel и начинает заполнять резюме:</h2>
        <input
          type="text"
          className="border p-2 mb-2 w-full max-w-sm"
          placeholder="Имя"
          onChange={(e) => setUsername(e.target.value)}
        /><br />
        <input
          type="text"
          className="border p-2 mb-2 w-full max-w-sm"
          placeholder="Пол"
        /><br />
        <input
          type="text"
          className="border p-2 mb-2 w-full max-w-sm"
          placeholder="Юрский университет"
        /><br />
        <input
          type="text"
          className="border p-2 mb-4 w-full max-w-sm"
          placeholder="Хобби"
        /><br />
        <button
          className="bg-yellow-300 hover:bg-yellow-400 p-2 rounded"
          onClick={() => username.trim() && setStep("vacancy")}
        >
          Отправить резюме
        </button>
      </div>
    );
  }

  // 4. Вакансия
  if (step === "vacancy") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl mb-2">Jurassic Jobs</h2>
        <img src="https://placehold.co/600x300?text=Вакансия+%22Стажёр%22" alt="vacancy" className="mx-auto mb-4" />
        <p>Стажёр отдела развития бизнеса. Зарплата: еда и опыт.</p>
        <button className="bg-yellow-300 hover:bg-yellow-400 p-2 rounded" onClick={() => setStep("letter")}>
          Откликнуться
        </button>
      </div>
    );
  }

  // 5. Приглашение на собеседование
  if (step === "letter") {
    return (
      <div className="p-6 text-center">
        <img src="https://placehold.co/600x300?text=Письмо-приглашение" alt="letter" className="mx-auto mb-4" />
        <p>Уважаемый(ая) {username || "Кирилл"}, приглашаем вас на собеседование в Jurassic Corp.</p>
        <button className="bg-yellow-300 hover:bg-yellow-400 p-2 rounded" onClick={() => setStep("intro")}>
          Прийти в офис
        </button>
      </div>
    );
  }

  // Далее — твои уже готовые экраны:
  // - "intro" → настройка настроения
  // - "name" → ввод имени (повторится, можно опустить)
  // - "quiz" → основной тест
  // - "end" → финальный экран

  // 👇 здесь идут ТВОИ КОД-БЛОКИ без изменений:
  if (step === "intro") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Jurassic Corp: Табличные джунгли</h1>
        <img src="https://placehold.co/600x200?text=Заставка+Кирилла" alt="Кирилл заставка" className="mx-auto mb-4" />
        <p className="mb-2">Привет! Ты на собеседовании в крупнейшую корпорацию по производству корма для динозавров.</p>
        <p className="mb-4">Перед началом давай немного настроим антураж.</p>
        <button
          className="bg-yellow-300 hover:bg-yellow-400 p-2 rounded m-2"
          onClick={() => {
            setMood("good");
            setStep("name");
          }}
        >
          Аристарх сегодня в хорошем настроении
        </button>
        <button
          className="bg-yellow-300 hover:bg-yellow-400 p-2 rounded m-2"
          onClick={() => {
            setMood("bad");
            setStep("name");
          }}
        >
          Аристарх явно не выспался
        </button>
      </div>
    );
  }

  if (step === "name") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl mb-4">Как зовут твоего персонажа?</h2>
        <input
          type="text"
          className="border p-2 mb-4 w-full max-w-sm"
          placeholder="Введите имя"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <button
          className="bg-yellow-300 hover:bg-yellow-400 p-2 rounded"
          onClick={() => {
            if (username.trim()) setStep("quiz");
          }}
        >
          Начать собеседование
        </button>
      </div>
    );
  }

  if (step === "quiz") {
    const q = questions[questionIndex];
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="text-sm text-gray-600 mb-2">Аристарх ({mood === "good" ? "спокоен" : "угрюм"})</div>
        <h2 className="text-xl font-bold mb-2">Вопрос {questionIndex + 1} из {questions.length}</h2>
        <p className="mb-4">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={selected}
              className={`w-full p-2 rounded ${
                selected === opt
                  ? opt === q.correct
                    ? "bg-green-300"
                    : "bg-red-300"
                  : "bg-yellow-300 hover:bg-yellow-400"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {ariResponse && (
          <div className="mt-4 p-3 border-l-4 border-black bg-yellow-100 italic">
            <strong>Аристарх:</strong> {ariResponse}
          </div>
        )}
      </div>
    );
  }

  if (step === "end") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Собеседование завершено</h1>
        <img src="https://placehold.co/400x150?text=Финальный+экран" alt="Финал" className="mx-auto mb-4" />
        <p className="mb-2">{username}, ты набрал {score} из {questions.length} баллов.</p>
        <p>Настроение Аристарха: {mood === "good" ? "в порядке" : "в ярости"}</p>
        <p className="mt-4">Поздравляем! Ждите звонка из отдела кадров 🦕</p>
      </div>
    );
  }

  return null;
};

export default App;

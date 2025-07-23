// Игра: Jurassic Excel — обновлённый сюжет и механика
import React, { useState } from "react";

// Компонент кнопки с единым стилем
const ChoiceButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded shadow mb-2 w-full"
  >
    {children}
  </button>
);

// Компонент диалогового окна с персонажем
const DialogBox = ({ character, mood, children }) => (
  <div className="p-4 border-l-4 bg-yellow-100 border-black text-left mb-4">
    <p className="text-sm italic font-semibold">{character} ({mood}) говорит:</p>
    <p className="mt-1">{children}</p>
  </div>
);

const App = () => {
  const [step, setStep] = useState("rewind");
  const [username, setUsername] = useState("");
  const [mood, setMood] = useState("good");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [ariResponse, setAriResponse] = useState("");
  const [reputation, setReputation] = useState(5);
  const [finalChoice, setFinalChoice] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [mistakes, setMistakes] = useState([]); // Храним ошибки
  const [ariImage, setAriImage] = useState(null);

  
  const questions = [
    {
      question: "Какой синтаксис у функции СУММ в Excel?",
      options: ["=SUMM(A1:A5)", "=СУММ(A1:A5)", "=TOTAL(A1:A5)", "=СУМА(A1:A5)"],
      correct: "=СУММ(A1:A5)",
      topic: "Формулы"
    },
    {
      question: "Что делает функция СРЗНАЧ?",
      options: ["Считает сумму значений", "Определяет максимальное значение", "Считает среднее арифметическое", "Форматирует ячейки"],
      correct: "Считает среднее арифметическое",
      topic: "Формулы"
    },
    {
      question: "Какая формула вернёт наибольшее значение в диапазоне?",
      options: ["=MIN(A1:A5)", "=СРЗНАЧ(A1:A5)", "=MAX(A1:A5)", "=IF(A1>A2,A1,A2)"],
      correct: "=MAX(A1:A5)",
      topic: "Формулы"
    },
    {
      question: "Как задать числовой формат с двумя знаками после запятой?",
      options: ["Формат ячеек > Числовой > Два знака после запятой", "Применить формулу ОКРУГЛ", "Поставить точку вручную", "Невозможно задать"],
      correct: "Формат ячеек > Числовой > Два знака после запятой",
      topic: "Форматирование"
    },
    {
      question: "Что выбрать вместо ВПР в Excel 365?",
      options: ["=XLOOKUP(...) / =ПРОСМОТРХ(...)", "=Индекс + Поиск", "=ГПР", "=ФИЛЬТР"],
      correct: "=XLOOKUP(...) / =ПРОСМОТРХ(...)",
      topic: "Поиск"
    },
  ];

  const ariPhrases = {
    good: {
      correct: [
        "Отлично! Я вижу, ты не зря окончил Юрский университет.",
        "Так держать! У нас любят динозавров, которые думают.",
        "Неплохо справляешься, молодец!"
      ],
      incorrect: [
        "Ошибся, бывает. Главное — делать выводы!",
        "Ничего страшного. Мы учимся на ошибках.",
        "Я тоже не с первого раза понял Excel."
      ]
    },
    bad: {
      correct: [
        "Ну наконец-то что-то правильное.",
        "Ты это сам сделал, или кто-то подсказал?",
        "Случайно правильно нажал?"
      ],
      incorrect: [
        "Вот так и знал, что ты не тянешь.",
        "Это даже не смешно.",
        "Как ты вообще сюда попал?"
      ]
    }
  };

  const getAriResponse = (isCorrect) => {
  const phrases = ariPhrases[mood][isCorrect ? "correct" : "incorrect"];
  const text = phrases[Math.floor(Math.random() * phrases.length)];
  const image = `/ari_${mood}_${isCorrect ? "happy" : "sad"}.jpg`;
  return { text, image };
};

const ErrorStats = ({ mistakes }) => (
  <div className="mt-6">
    <h3 className="font-bold text-lg mb-2">Ошибки:</h3>
    {mistakes.length === 0 ? (
      <p>Ты не допустил ни одной ошибки!</p>
    ) : (
      <ul className="list-disc ml-6">
        {mistakes.map((m, i) => (
          <li key={i}>
            <strong>{m.question}</strong><br />
            Твой ответ: <code>{m.userAnswer}</code><br />
            Правильный ответ: <code>{m.correctAnswer}</code>
          </li>
        ))}
      </ul>
    )}
  </div>
);

  const handleAnswer = (opt) => {
  if (selected) return; // чтобы нельзя было кликнуть дважды
  setSelected(opt);

  const isCorrect = opt === questions[questionIndex].correct;
  if (isCorrect) {
    setScore(prev => prev + 1);
    setMood("good");
    setAriResponse("Хм. Верно. Продолжим.");
    setAriImage("/ari_good_happy.jpg");
  } else {
    setMood("bad");
    setAriResponse("Неверно... Надеюсь, это не всё, на что ты способен.");
    setAriImage("/ari_good_sad.jpg");
  }

  // перейти к следующему вопросу через задержку
  setTimeout(() => {
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(prev => prev + 1);
      setSelected(null);
      setAriResponse("");
      setAriImage(null);
    } else {
      setStep("quiz-end");
    }
  }, 2000);
};


  const [testPassed, setTestPassed] = useState(false); // или true, для демонстрации
  const handleSendFeedback = async () => {
    const message = `🦖 Новый отзыв от ${username || "Неизвестный динозавр"}:%0A${feedback}`;
    const chatId = "@your_channel_or_chat_id";
    const token = "123456:ABCDEF...";
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}`;
    try {
      await fetch(url);
      alert("Спасибо за отзыв!");
      setFeedback("");
    } catch (err) {
      alert("Не удалось отправить отзыв");
    }
  };

  if (step === "rewind") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Вы спите. Вам снится сон, что динозавры не вымерли, а вполне себе дожили до наших дней и эволюционировали…</h1>
        <img src="/meteor.jpg" alt="rewind" className="w-full max-w-md max-h-[40vh] object-contain mb-4 rounded" />
        <ChoiceButton onClick={() => setStep("wake")}>Проснуться</ChoiceButton>
      </div>
    );
  }

if (step === "wake") {
  return (
    <div className="p-6 text-center flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4">Вы просыпаетесь в шкуре динозавра Кирилла. Как поступите?</h2>
      <img
        src="/room.jpg"
        alt="wake"
        className="w-full max-w-md max-h-[40vh] object-contain mb-4 rounded"
      />
      <ChoiceButton onClick={() => setStep("active-morning")}>
        Подняться с кровати
      </ChoiceButton>
      <ChoiceButton onClick={() => setStep("lazy-morning")}>
        Поваляться ещё
      </ChoiceButton>
    </div>
  );
}

  if (step === "lazy-morning") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Вы проспали! Звонит кадровик...</h2>
        <img src="/hand.png" alt="звонок" className="w-full max-w-md max-h-[40vh] object-contain mb-4 rounded" />
        <p>«Кирилл, у вас собеседование через час!»</p>
        <ChoiceButton onClick={() => setStep("dry-breakfast")}>Быстро собраться</ChoiceButton>
      </div>
    );
  }

 if (step === "active-morning") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Кирилл позавтракал, потренировался, умылся.</h2>
        <img src="/porridge.jpg" alt="бутерброд" className="w-full max-w-md max-h-[40vh] object-contain mb-4 rounded" />
        <ChoiceButton onClick={() => { setMood("good"); setStep("good-call") }}>Настроение значительно улучшилось!</ChoiceButton>
      </div>
    );
  }
 if (step === "good-call") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Звонок из HR: «Собеседование через час. Ждём!»</h2>
        <img src="/hand.png" alt="звонок" className="w-full max-w-md max-h-[40vh] object-contain mb-4 rounded" />
        <p>«Супер, обязательно буду!»</p>
        <ChoiceButton onClick={() => { setMood("good"); setStep("grandma") }}>Выйти на улицу</ChoiceButton>
      </div>
    );
  }

  if (step === "dry-breakfast") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Завтрак в спешке</h2>
        <img src="/bread.jpg" alt="бутерброд" className="w-full max-w-md max-h-[40vh] object-contain mb-4 rounded" />
        <p>Настроение испортилось. Кирилл раздражён.</p>
        <ChoiceButton onClick={() => { setMood("bad"); setStep("grandma") }}>Выйти на улицу</ChoiceButton>
      </div>
    );
  }

  

  if (step === "grandma") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">У подъезда бабка</h2>
        <img src="/babka1.jpg" alt="бабка" className="w-full max-w-md max-h-[40vh] object-contain mb-4 rounded" />
        <p>Она машет Кириллу и явно что-то от него хочет. Как отреагируете?</p>
        <ChoiceButton onClick={() => { setReputation(r => r - 1); setStep("next") }}>Нахамить</ChoiceButton>
        <ChoiceButton onClick={() => setStep("next")}>Поздароваться</ChoiceButton>
      </div>
    );
  }


  if (step === "next") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Как добираться до офиса?</h2>
        <img src="/pterotaxi.png" alt="транспорт" className="w-full max-w-md max-h-[40vh] object-contain mb-4 rounded" />
        <ChoiceButton onClick={() => setStep("city_fly")}>Взять таксиродактиль</ChoiceButton>
        <ChoiceButton onClick={() => {
          const late = Math.random() < 0.3;
          if (late) setMood("bad");
          setStep("city_earth");
        }}>Сесть на динодобус</ChoiceButton>
      </div>
    );
  }

  if (step === "city_fly") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Вы наслаждаетесь видом на город и прибываете вовремя</h2>
        <img src="/city2.jpg" alt="город" className="w-full max-w-md max-h-[40vh] object-contain mb-4 rounded" />
        <ChoiceButton onClick={() => setStep("building")}>Подъезжает здание Jurassic Corp</ChoiceButton>
      </div>
    );
  }

  if (step === "city_earth") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Вы видите вдалеке Jurassic corp, и переживаете, что можете опоздать </h2>
        <img src="/city down.jpg" alt="город" className="w-full max-w-md max-h-[40vh] object-contain mb-4 rounded" />
        <ChoiceButton onClick={() => setStep("building")}>Подъезжает здание Jurassic Corp</ChoiceButton>
      </div>
    );
  }

  if (step === "building") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Офис Jurassic Corp</h2>
        <img src="/jurassic corp.jpg" alt="офис" className="w-full max-w-md max-h-[40vh] object-contain mb-4 rounded" />
        <ChoiceButton onClick={() => setStep("reception_start")}>Зайти в здание</ChoiceButton>
      </div>
    );
  }

  if (step === "reception_start") {
    const appearanceOk = mood === "good" && reputation >= 5;
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Ресепшен Jurassic Corp</h2>
        <img src="/reception.jpg" alt="ресепшен" className="w-full max-w-md max-h-[40vh] object-contain mb-4 rounded" />
        <p>К вам подходит Аристарх.</p>
        <ChoiceButton
          onClick={() => setStep("intro")}>Ждать...</ChoiceButton>
      </div>
    );
  }
  if (step === "intro") {
    const appearanceOk = mood === "good" && reputation >= 5;
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">К вам подходит Аристарх.</h2>
        <img src="/intro.jpg" alt="ресепшен" className="w-full max-w-md max-h-[40vh] object-contain mb-4 rounded" />
        <p>К вам подходит Аристарх.</p>
        <ChoiceButton
          onClick={() => {
            if (!appearanceOk) {
              setMood("bad");
            }
            setStep("hall-talk");
          }}
        >Поздороваться с Аристархом</ChoiceButton>
      </div>
    );
  }

  if (step === "hall-talk") {
    const friendly = mood === "good" && reputation >= 5;
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Коридор офиса</h2>
        <img src="/hall.png" alt="коридор" className="w-full max-w-md max-h-[40vh] object-contain mb-4 rounded" />
        <DialogBox character="Аристарх" mood={mood}>
          {friendly ? "Долго до нас добирались? ." : "Юрский закончили? Ну посмотрим, что вы там знаете..."}
        </DialogBox>
        <ChoiceButton onClick={() => setStep("quiz")}>Начать собеседование</ChoiceButton>
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
        {ariResponse && ariImage && (
  <div className="mt-4 flex items-start gap-4">
    <img src={ariImage} alt="Аристарх" className="w-24 h-24 object-contain" />
    <div className="p-3 border-l-4 border-black bg-yellow-100 italic flex-1">
      <strong>Аристарх:</strong> {ariResponse}
    </div>
  </div>
)}
      
      </div>
    );
  }

 
if (step === "quiz-end") {
  return (
    <div className="p-6 text-center space-y-4">
      <h1 className="text-2xl text-black font-bold">Результаты собеседования</h1>
      <p className="text-lg text-black">
        Ты набрал <strong>{score}</strong> из {questions.length} баллов!
      </p>
      <p className="italic text-black">Мы вам перезвоним… возможно.</p>
   <img src="/hall.png" alt="коридор" className="w-full max-w-md max-h-[40vh] object-contain mb-4 rounded" />
    </div>
  );
}

}

export default App;

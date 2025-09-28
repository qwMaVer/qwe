import { useEffect } from "react";

function App() {
  useEffect(() => {
    const tg = window.Telegram.WebApp;

    // Сообщаем Telegram, что приложение готово
    tg.ready();

    console.log("Telegram объект:", window.Telegram);


    // Пример: меняем фон внутри Telegram
    tg.setBackgroundColor("#F4F4F4");
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Моё первое Telegram MiniApp 🚀</h1>
      <p>Если видишь это в браузере — значит SDK подключен.</p>
      <p>А в консоли браузера (F12 → Console) появится объект Telegram.</p>
    </div>
  );
}

export default App;

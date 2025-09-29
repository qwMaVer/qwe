import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    // Берём данные о пользователе
    const initData = tg.initDataUnsafe;

    if (initData?.user) {
      setUser(initData.user);
      console.log("Данные пользователя:", initData.user);
    } else {
      console.log("Пользовательские данные не найдены (браузер).");
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Telegram MiniApp 🚀</h1>

      {user ? (
        <div>
          <p><b>ID:</b> {user.id}</p>
          <p><b>Имя:</b> {user.first_name}</p>
          <p><b>Юзернейм:</b> @{user.username}</p>
        </div>
      ) : (
        <p>Открой меня внутри Telegram, чтобы увидеть свои данные</p>
      )}
    </div>
  );
}

export default App;

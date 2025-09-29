import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    const initData = tg.initDataUnsafe;

    if (initData?.user) {
      const u = initData.user;
      setUser(u);

      // Отправляем данные пользователя на backend
      fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: u.id,
          first_name: u.first_name,
          username: u.username,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Ответ от backend:", data);
          setUser(data); // теперь user = с балансом
          setLoading(false);
        })
        .catch((err) => {
          console.error("Ошибка:", err);
          setLoading(false);
        });
    } else {
      console.log("Пользовательские данные не найдены (браузер).");
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Загрузка...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Telegram MiniApp 🚀</h1>

      {user ? (
        <div>
          <p><b>ID:</b> {user.id}</p>
          <p><b>Имя:</b> {user.first_name}</p>
          <p><b>Юзернейм:</b> @{user.username}</p>
          <p><b>Баланс:</b> {user.balance} ⭐</p>
        </div>
      ) : (
        <p>Открой меня внутри Telegram, чтобы увидеть свои данные</p>
      )}
    </div>
  );
}

export default App;

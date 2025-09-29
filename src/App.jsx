import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  const prizes = [
    "🎁 50⭐ бонус",
    "🎉 Стикер Telegram",
    "🌟 NFT приз",
    "😢 Пусто, ничего не выиграл",
    "🔥 Редкий NFT",
  ];

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    const initData = tg.initDataUnsafe;

    if (initData?.user) {
      const u = initData.user;

      fetch("http://localhost:3000/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: u.id, first_name: u.first_name, username: u.username }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const spinWheel = () => {
    if (!user || user.balance < 10) {
      alert("Недостаточно звезд ⭐ для крутки (10⭐)");
      return;
    }

    // уменьшаем баланс локально
    setUser((prev) => ({ ...prev, balance: prev.balance - 10 }));

    // отправляем на backend, чтобы сохранить
    fetch("http://localhost:3000/user/spin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setResult(data.lastPrize);
      });
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Telegram MiniApp 🚀</h1>

      {user ? (
        <div>
          <p><b>ID:</b> {user.id}</p>
          <p><b>Имя:</b> {user.first_name}</p>
          <p><b>Баланс:</b> {user.balance} ⭐</p>

          <button onClick={spinWheel} style={{ padding: "10px 20px", marginTop: 20 }}>
            Крутить рулетку (10⭐)
          </button>

          {result && (
            <div style={{ marginTop: 20, fontSize: 20 }}>
              🎯 Результат: {result}
            </div>
          )}
        </div>
      ) : (
        <p>Открой меня внутри Telegram, чтобы увидеть свои данные</p>
      )}
    </div>
  );
}

export default App;

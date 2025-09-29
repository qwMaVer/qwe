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
        body: JSON.stringify({
          id: u.id,
          first_name: u.first_name,
          username: u.username,
        }),
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

  if (loading) return <p className="text-white text-xl text-center">Загрузка...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-red-500 mb-6">
        Проверка Tailwind 🚀
      </h1>

      {user ? (
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl text-center">
          <p><b>ID:</b> {user.id}</p>
          <p><b>Имя:</b> {user.first_name}</p>
          <p><b>Баланс:</b> {user.balance} ⭐</p>

          <button
            onClick={spinWheel}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
          >
            🎰 Крутить рулетку (10⭐)
          </button>

          {result && (
            <div className="mt-6 text-2xl font-semibold">
              🎯 Результат: {result}
            </div>
          )}
        </div>
      ) : (
        <p>Открой MiniApp в Telegram, чтобы увидеть свои данные</p>
      )}
    </div>
  );
}

export default App;

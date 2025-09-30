import "./App.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const prizes = [
    "🎁 50⭐ бонус",
    "🎉 Стикер Telegram",
    "🌟 NFT приз",
    "😢 Пусто",
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
    if (!user || user.balance < 10 || spinning) {
      alert("Недостаточно ⭐ или колесо уже крутится");
      return;
    }

    setUser((prev) => ({ ...prev, balance: prev.balance - 10 }));

    const randomIndex = Math.floor(Math.random() * prizes.length);
    const segmentAngle = 360 / prizes.length;
    const finalRotation =
      rotation + 360 * 5 + (360 - randomIndex * segmentAngle - segmentAngle / 2);

    setRotation(finalRotation);
    setSpinning(true);

    setTimeout(() => {
      setSpinning(false);
      setResult(prizes[randomIndex]);

      fetch("http://localhost:3000/user/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id }),
      })
        .then((res) => res.json())
        .then((data) => setUser(data));
    }, 5000);
  };

  const addBalance = () => {
    fetch("http://localhost:3000/user/addBalance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, amount: 50 }),
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  };

  if (loading)
    return (
      <div className="app-container loading">
        <p>Загрузка...</p>
      </div>
    );

  return (
    <div className="app-container">
      <motion.h1
        className="title"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🎰 Telegram MiniApp: Кастомная рулетка
      </motion.h1>

      {user ? (
        <div className="user-section">
          <p>👤 {user.first_name}</p>
          <p className="balance">💰 Баланс: {user.balance} ⭐</p>

          <div className="arrow"></div>

          <motion.div
            className="wheel"
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
            animate={{ rotate: rotation }}
            transition={{ duration: 5, ease: "easeOut" }}
          >
            {/* Сегменты можно будет подписывать через CSS или позже */}
          </motion.div>

          <button className="spin-btn" onClick={spinWheel} disabled={user.balance < 10 || spinning}>
            🎲 Крутить рулетку (10⭐)
          </button>

          <button className="add-btn" onClick={addBalance}>
            ➕ Пополнить баланс (+50⭐)
          </button>

          {result && <div className="result">🎯 Результат: {result}</div>}
        </div>
      ) : (
        <p>Открой MiniApp в Telegram, чтобы увидеть свои данные</p>
      )}
    </div>
  );
}

export default App;

import "./App.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [activeTab, setActiveTab] = useState("wheel"); // 🎯 текущая вкладка

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

  // 🎰 Крутка рулетки
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
        .then((data) => {
          setUser(data);
        });
    }, 5000);
  };

  // 💰 Пополнение баланса
  const addBalance = () => {
    fetch("http://localhost:3000/user/addBalance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, amount: 50 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });
  };

  if (loading)
    return (
      <div className="loading-screen">
        <p>Загрузка...</p>
      </div>
    );

  return (
    <div className="app-container">
      <div className="content">
        {/* 🎡 Вкладка "Рулетка" */}
        {activeTab === "wheel" && (
          <div className="wheel-tab">
            <h1>🎰 Крутка рулетки</h1>

            {/* Стрелка */}
            <div className="arrow"></div>

            {/* Колесо */}
            <motion.div
              className="wheel"
              style={{
                background: `conic-gradient(
                  #FF6B6B 0deg ${360 / prizes.length}deg,
                  #FFD93D ${360 / prizes.length}deg ${(360 / prizes.length) * 2}deg,
                  #6BCB77 ${(360 / prizes.length) * 2}deg ${(360 / prizes.length) * 3}deg,
                  #4D96FF ${(360 / prizes.length) * 3}deg ${(360 / prizes.length) * 4}deg,
                  #9D4EDD ${(360 / prizes.length) * 4}deg 360deg
                )`,
              }}
              animate={{ rotate: rotation }}
              transition={{ duration: 5, ease: "easeOut" }}
            />

            <motion.button
              onClick={spinWheel}
              className="spin-btn"
              whileTap={{ scale: 0.9 }}
              disabled={user.balance < 10 || spinning}
            >
              🎲 Крутить (10⭐)
            </motion.button>

            {result && (
              <motion.div
                className="result"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                🎯 Результат: {result}
              </motion.div>
            )}
          </div>
        )}

        {/* 💰 Вкладка "Баланс" */}
        {activeTab === "balance" && (
          <div className="balance-tab">
            <h1>💰 Баланс</h1>
            <p>Ваш баланс: {user.balance} ⭐</p>
            <motion.button
              onClick={addBalance}
              className="balance-btn"
              whileTap={{ scale: 0.9 }}
            >
              ➕ Пополнить (+50⭐)
            </motion.button>
          </div>
        )}

        {/* 👤 Вкладка "Профиль" */}
        {activeTab === "profile" && (
          <div className="profile-tab">
            <h1>👤 Профиль</h1>
            <p>ID: {user.id}</p>
            <p>Имя: {user.first_name}</p>
            <p>Username: @{user.username}</p>
          </div>
        )}
      </div>

      {/* Нижнее меню */}
      <div className="bottom-nav">
        <button
          className={activeTab === "wheel" ? "active" : ""}
          onClick={() => setActiveTab("wheel")}
        >
          🎡
        </button>
        <button
          className={activeTab === "balance" ? "active" : ""}
          onClick={() => setActiveTab("balance")}
        >
          💰
        </button>
        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          👤
        </button>
      </div>
    </div>
  );
}

export default App;

import "./App.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function App() {
  const [activeTab, setActiveTab] = useState("roulette");
  const [user, setUser] = useState(null);
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
        .then((data) => setUser(data))
        .catch((err) => console.error(err));
    }
  }, []);

  const spinWheel = () => {
    if (!user || user.balance < 10 || spinning) {
      alert("Недостаточно ⭐ или колесо крутится");
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

  return (
    <div className="app-container">
      <div className={`content ${activeTab}`}>
        {activeTab === "roulette" && (
          <>
            <h1>🎰 Рулетка</h1>
            {user && (
              <>
                <div className="arrow"></div>
                <motion.div
                  className="wheel"
                  animate={{ rotate: rotation }}
                  transition={{ duration: 5, ease: "easeOut" }}
                />
                <button className="action spin-btn" onClick={spinWheel}>
                  🎲 Крутить (10⭐)
                </button>
                {result && <div className="result">🎯 {result}</div>}
              </>
            )}
          </>
        )}

        {activeTab === "balance" && (
          <>
            <h1>💰 Баланс</h1>
            {user && (
              <>
                <p className="balance">⭐ {user.balance}</p>
                <button className="action balance-btn" onClick={addBalance}>
                  ➕ Пополнить (+50⭐)
                </button>
              </>
            )}
          </>
        )}

        {activeTab === "profile" && (
          <>
            <h1>👤 Профиль</h1>
            {user ? (
              <>
                <p>Имя: {user.first_name}</p>
                <p>Username: @{user.username}</p>
                <p>ID: {user.id}</p>
              </>
            ) : (
              <p>Открой MiniApp в Telegram</p>
            )}
          </>
        )}
      </div>

      <div className="bottom-nav">
        <button
          className={activeTab === "roulette" ? "active" : ""}
          onClick={() => setActiveTab("roulette")}
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

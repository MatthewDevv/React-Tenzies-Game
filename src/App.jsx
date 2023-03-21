import React, { useEffect, useState } from "react";
import "./App.scss";
import { nanoid } from "nanoid";
import Die from "./components/Die/Die";
import Confetti from "react-confetti";

export default function App() {
  function getRandomNumber(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  function createNewDie() {
    const randomValue = getRandomNumber(6);
    return { id: nanoid(), value: randomValue, isHeld: false };
  }

  function createAllNewDice() {
    const allNewDice = [];
    for (let i = 0; i < 10; i++) allNewDice.push(createNewDie());
    return allNewDice;
  }

  const [dice, setDice] = useState(createAllNewDice());
  const [isWin, setIsWin] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const bestScore = JSON.parse(localStorage.getItem("bestScore"));

  useEffect(() => {
    const isEveryValid = dice.every(
      (die) => die.value === dice[0].value && die.isHeld
    );
    if (isEveryValid) {
      setIsWin(true);
      setRunning(false);
      saveBestScore();
    }
  }, [dice]);

  useEffect(() => {
    let interval = null;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else clearInterval(interval);
    return () => clearInterval(interval);
  }, [running]);

  function saveBestScore() {
    if (bestScore) {
      if (bestScore > time)
        localStorage.setItem(
          "bestScore",
          JSON.stringify({ time: time, rolls: rolls })
        );
    } else
      localStorage.setItem(
        "bestScore",
        JSON.stringify({ time: time, rolls: rolls })
      );
  }

  function holdDice(id) {
    if (isWin) resetGame();
    if (!running) setRunning(true);

    setDice((prevDice) =>
      prevDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  function rollDice() {
    if (!running) setRunning(true);
    if (!isWin) {
      setDice((prevDice) =>
        prevDice.map((die) => (die.isHeld === true ? die : createNewDie()))
      );
      setRolls((prevRolls) => prevRolls + 1);
    } else resetGame();
  }

  function resetStopGame() {
    setDice(createAllNewDice());
    setIsWin(false);
    setRolls(0);
    setTime(0);
    setRunning(false);
  }

  function resetGame() {
    resetStopGame();
    setRunning(true);
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {isWin && <Confetti />}
      <h1 className="title">Gra w kości</h1>
      <p className="instructions">
        Rzucaj, aż wszystkie kostki będą takie same. Kliknij każdą kostkę, aby
        zamrozić ją na jej aktualnej wartości pomiędzy kolejnymi rzutami.
      </p>
      {bestScore && (
        <div className="best-score">
          <i className="bi bi-star-fill"></i>
          {Math.floor((bestScore.time / 60000) % 60)}:
          {Math.floor((bestScore.time / 1000) % 60)}:{bestScore.time % 1000} -{" "}
          {bestScore.rolls}
        </div>
      )}
      <div className="stopwatch">
        {Math.floor((time / 60000) % 60)}:{Math.floor((time / 1000) % 60)}:
        {time % 1000}
      </div>
      <div className="die-container">{diceElements}</div>
      <div>
        <div className="roll-count">{rolls}</div>
        <button onClick={rollDice} className="roll-btn">
          {isWin ? "nowa gra" : "rzucaj"}
        </button>
      </div>
      <button onClick={resetStopGame} className="stop-reset-btn">
        STOP & RESET
      </button>
    </main>
  );
}

import React from "react";
import "./Die.scss";
import { nanoid } from "nanoid";

export default function Die(props) {
  const dotsValueClass = "dots-" + props.value;

  function createDots() {
    const dots = [];
    for (let i = 0; i < props.value; i++)
      dots.push(<span key={nanoid()} className="dot"></span>);
    return dots;
  }

  return (
    <button
      onClick={props.holdDice}
      className={`die-btn ${dotsValueClass} ${props.isHeld ? "held" : ""}`}
    >
      {createDots()}
    </button>
  );
}

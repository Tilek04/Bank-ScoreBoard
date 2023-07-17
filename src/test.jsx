import React, { useEffect, useState } from "react";

const Test = () => {
  const talons = ["B1001", "B1-0-4-0-2", "B1-0-0-1-0-1"];
  const [index, setIndex] = useState(0);

  let utterance = new SpeechSynthesisUtterance();

  utterance.onend = function () {
    if (index < talons.length - 1) {
      setIndex((prev) => prev + 1);
    }
  };

  function sayTalon() {
    utterance.text = talons[index];
    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    sayTalon();
  }, [index]);

  return (
    <div>
      <h1>{talons[index]}</h1>
      <button onClick={() => sayTalon()}>Озвучить</button>
    </div>
  );
};

export default Test;

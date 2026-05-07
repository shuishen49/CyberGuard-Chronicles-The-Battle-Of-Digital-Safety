import { useEffect } from "react";

const PhishingSimulator = () => {
  useEffect(() => {
    window.location.href = "https://ayush712gupta.github.io/PhishingAttack/level_1/level_1.html";
  }, []);

  return <p>正在跳转……</p>;
};

export default PhishingSimulator;

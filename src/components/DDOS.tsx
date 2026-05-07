import { useEffect } from "react";

const DDOS = () => {
  useEffect(() => {
    window.location.href = "https://ddos-attack712.blogspot.com/";
  }, []);

  return <p>正在跳转……</p>;
};

// eslint-disable-next-line react-refresh/only-export-components
export default DDOS;

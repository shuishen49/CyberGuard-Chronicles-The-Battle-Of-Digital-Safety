import { useEffect } from "react";

const CHS = () => {
  useEffect(() => {
    window.location.href = "https://cyber-hygiene-checklist.blogspot.com/";
  }, []);

  return <p>正在跳转……</p>;
};

// eslint-disable-next-line react-refresh/only-export-components
export default CHS;

import { useEffect } from "react";

const CyberAware = () => {
  useEffect(() => {
    // 本地托管的 Sense Hacker 游戏，位于 public/IntroToCyber-main/
    // 通过 import.meta.env.BASE_URL 自动适配 Vite 的 base 前缀
    window.location.href = `${import.meta.env.BASE_URL}IntroToCyber-main/index.html`;
  }, []);

  return <p>正在跳转……</p>;
};

export default CyberAware;

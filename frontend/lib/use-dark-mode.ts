"use client";

import { useEffect, useState } from "react";

export function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return dark;
}

export const chartColors = {
  light: {
    grid: "#E3E8EF",
    tick: "#8896A6",
    tooltipBg: "#FFFFFF",
    tooltipBorder: "#E3E8EF",
    text: "#0D1B2A",
  },
  dark: {
    grid: "#2A4F7A",
    tick: "#8896A6",
    tooltipBg: "#162A3E",
    tooltipBorder: "#2A4F7A",
    text: "#F6F8FB",
  },
};

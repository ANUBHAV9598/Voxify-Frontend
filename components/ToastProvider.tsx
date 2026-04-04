"use client";

import { ToastContainer } from "react-toastify";
import { useTheme } from "next-themes";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={3200}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastClassName="!rounded-2xl"
    />
  );
}

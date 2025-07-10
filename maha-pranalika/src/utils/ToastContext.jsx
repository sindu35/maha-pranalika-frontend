import React, { createContext, useContext, useState } from "react";
import "../styles/toast.css";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = ++toastId;
    setToasts((prev) => [{ id, message, type }, ...prev]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(({ id, message, type }) => (
          <div
            key={id}
            className={`toast-box toast-${type}`}
          >
            {message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
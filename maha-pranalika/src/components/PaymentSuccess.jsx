import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  const location = useLocation();
  const { fullName, transactionId, amount } = location.state || {};

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="payment">
    <div className="payment-root">
      <Confetti width={dimensions.width} height={dimensions.height} />
      <div className="payment-container">
        <div className="payment-card">
          <div className="checkmark">✔</div>
          <h2>Payment<br />Successful!</h2>
          <p>Thank you, <strong>{fullName || "User"}</strong>!</p>
          <p>Your transaction has been completed</p>
          <h3>₹{amount  || "249.99"}</h3>
          <div className="transaction-id">
            Transaction ID: {transactionId || "TXN-UNKNOWN"}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

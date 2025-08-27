// frontend/src/ThankYou.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ThankYou.css";

export default function ThankYou() {
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    // Retrieve payment info from localStorage
    const info = localStorage.getItem("paymentInfo");
    if (info) setPaymentInfo(JSON.parse(info));

    // Redirect to home after 10 seconds
    const timer = setTimeout(() => navigate("/"), 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="thankyou-container">
      <h1>🎉 Thank You!</h1>
      {paymentInfo ? (
        <>
          <p>
            Payment successful for <strong>{paymentInfo.siteType}</strong>.
          </p>
          <p>
            Amount paid: <strong>GHS {paymentInfo.amount}</strong>
          </p>
          <p>
            Payment reference: <strong>{paymentInfo.reference}</strong>
          </p>
        </>
      ) : (
        <p>Your payment was successful.</p>
      )}
      <p>You will be redirected shortly...</p>
    </div>
  );
}

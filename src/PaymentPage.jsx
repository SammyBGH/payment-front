// frontend/src/PaymentPage.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PaymentPage.css";

export default function PaymentPage() {
  const SITE_TYPES = {
    "Static Website": 100,
    "Dynamic Website": 500,
    "E-commerce Website": 900,
  };

  const [form, setForm] = useState({ name: "", email: "", siteType: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-fill amount if site type changes
    if (name === "siteType") {
      const price = SITE_TYPES[value] || "";
      setForm({ ...form, siteType: value, amount: price });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Record payment in backend
  const recordPayment = async (reference) => {
    try {
      const token = localStorage.getItem("token"); // JWT if needed
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payments/record`,
        {
          reference,
          name: form.name,
          email: form.email,
          siteType: form.siteType,
          amount: form.amount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Failed to record payment:", err);
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!window.PaystackPop) {
      alert("Paystack script not loaded yet.");
      setLoading(false);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: form.email,
      amount: form.amount * 100, // convert GHS to kobo
      currency: "GHS",
      ref: `site-${Math.floor(Math.random() * 1000000000)}`,
      metadata: {
        custom_fields: [
          { display_name: "Name", variable_name: "name", value: form.name },
          { display_name: "Website Type", variable_name: "siteType", value: form.siteType },
        ],
      },
      callback: function (response) {
        // Save payment info for Thank You page
        localStorage.setItem(
          "paymentInfo",
          JSON.stringify({
            name: form.name,
            siteType: form.siteType,
            amount: form.amount,
            reference: response.reference,
          })
        );

        recordPayment(response.reference);
        setLoading(false);
        navigate("/thank-you"); // redirect
      },
      onClose: function () {
        alert("Payment closed.");
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  return (
    <div className="payment-container">
      <h1>Pay with Paystack</h1>
      <form onSubmit={handlePayment}>
        <label>Name:</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required disabled={loading} />

        <label>Email:</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required disabled={loading} />

        <label>Type of Website:</label>
        <select name="siteType" value={form.siteType} onChange={handleChange} required disabled={loading}>
          <option value="">-- Select a site type --</option>
          {Object.keys(SITE_TYPES).map((type) => (
            <option key={type} value={type}>
              {type} (GHS {SITE_TYPES[type]})
            </option>
          ))}
        </select>

        <label>Amount (GHS):</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Enter amount in GHS"
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}

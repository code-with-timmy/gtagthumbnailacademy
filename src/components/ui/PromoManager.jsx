import React, { useState, useEffect } from "react";

const PromoManager = () => {
  const [status, setStatus] = useState("BEFORE"); // BEFORE, ACTIVE, EXPIRED
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // Dates in UTC (PST is UTC-8)
    const launchDate = new Date("2026-01-01T08:00:00Z").getTime();
    const endDate = new Date("2026-01-07T08:00:00Z").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();

      let target;
      if (now < launchDate) {
        setStatus("BEFORE");
        target = launchDate;
      } else if (now < endDate) {
        setStatus("ACTIVE");
        target = endDate;
      } else {
        setStatus("EXPIRED");
        clearInterval(timer);
        return;
      }

      const distance = target - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${days > 0 ? days + "d " : ""}${hours}h ${minutes}m ${seconds}s`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (status === "EXPIRED") return null;

  return (
    <div
      className={`py-2 px-4 text-center text-sm font-medium text-white transition-all duration-500 ${
        status === "BEFORE"
          ? "bg-slate-900"
          : "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"
      }`}
    >
      {status === "BEFORE" ? (
        <span>
          DISCOUNT SALE STARTS IN:{" "}
          <span className="font-mono ml-2">{timeLeft}</span>
        </span>
      ) : (
        <>
          <span className="animate-pulse mr-2">🔥</span>
          <span>New year Special: 50% Off All Plans</span>
          <span className="ml-3 px-2 py-0.5 bg-white/20 rounded text-xs font-bold">
            ENDS IN: {timeLeft}
          </span>
        </>
      )}
    </div>
  );
};

export default PromoManager;

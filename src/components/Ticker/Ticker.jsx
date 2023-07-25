import React from "react";
import { useEffect } from "react";
import { tabloStore } from "../../Zustand/store";

export const Ticker = () => {
  const getString = tabloStore((state) => state.getString);
  const tickets = tabloStore((state) => state.tickets);

  useEffect(() => {
    tabloStore.getState().getString();
  }, []);

  return (
    <div>
      <marquee direction="left" bgcolor="#104273" height="50px">
        <p
          style={{
            color: "#fff",
            fontSize: "30px",
            fontFamily: "sans-serif",
            paddingTop: "10px",
          }}>
          {tickets.map((ticket) => (
            <span key={ticket.id}>{ticket.text}</span>
          ))}
        </p>
      </marquee>
    </div>
  );
};

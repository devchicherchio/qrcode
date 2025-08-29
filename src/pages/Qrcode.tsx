import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaHamburger, FaStore, FaArrowRight, FaPizzaSlice } from "react-icons/fa";

type Item = {
  alias: "gil" | "hamburgueria" | "conveniencia" | "esfiharia";
  title: string;
  icon: React.ReactNode;
};

const ITEMS: Item[] = [
  { alias: "gil",           title: "Gil",           icon: <FaUserTie /> },
  { alias: "hamburgueria",  title: "Hamburgueria",  icon: <FaHamburger /> },
  { alias: "conveniencia",  title: "Conveniência",  icon: <FaStore /> },
  { alias: "esfiharia",     title: "Esfiharia",     icon: <FaPizzaSlice /> },
];

const Qrcode: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(130,184,63,.15), transparent), linear-gradient(180deg, #0f172a, #0b1220)",
        color: "#fff",
        padding: "clamp(12px, 3vw, 24px)",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,.06)",
          border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 20,
          padding: "clamp(18px, 3vw, 28px)",
          boxShadow: "0 10px 30px rgba(0,0,0,.35)",
          width: "100%",
          maxWidth: "min(1000px, 92vw)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <h2
            style={{
              margin: 0,
              fontWeight: 700,
              letterSpacing: 0.4,
              fontSize: "clamp(20px, 3.5vw, 28px)",
            }}
          >
            Escolha um QR Code
          </h2>
          <p style={{ margin: 0, color: "#cbd5e1", fontSize: "clamp(12px, 2.5vw, 14px)" }}>
            Clique em uma opção para abrir a página do QR PIX correspondente.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "clamp(8px, 2vw, 14px)",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            marginTop: 12,
          }}
        >
          {ITEMS.map((it) => (
            <button
              key={it.alias}
              onClick={() => navigate(`/qrcode/${it.alias}`)}
              aria-label={`Abrir QR de ${it.title}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(8px, 2vw, 12px)",
                width: "100%",
                padding: "clamp(12px, 2.5vw, 16px) clamp(12px, 2.5vw, 18px)",
                borderRadius: 16,
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.18)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                transition: "transform .15s ease, background .2s ease, box-shadow .2s ease",
                backdropFilter: "blur(4px)",
                fontSize: "clamp(14px, 2.8vw, 16px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = "rgba(255,255,255,.14)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.background = "rgba(255,255,255,.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span
                style={{
                  fontSize: "clamp(16px, 3.2vw, 20px)",
                  background: "rgba(255,255,255,.12)",
                  width: "clamp(34px, 7vw, 40px)",
                  height: "clamp(34px, 7vw, 40px)",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 12,
                  flexShrink: 0,
                }}
              >
                {it.icon}
              </span>
              <span>{it.title}</span>
              <span style={{ marginLeft: "auto", opacity: 0.7, display: "grid", placeItems: "center" }}>
                <FaArrowRight />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Qrcode;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

// Payloads “copia e cola” FIXOS
const PAYLOAD_FIXO_GIL =
  "00020126580014BR.GOV.BCB.PIX0136b5663a41-f817-49a6-945f-3d55609f4de05204000053039865802BR5901N6001C62070503***63044A7C";

const PAYLOAD_FIXO_HAMBURGUERIA =
  "00020126580014BR.GOV.BCB.PIX013619c3c534-c64c-4cc5-87cb-78446104b7dc5204000053039865802BR5901N6001C62070503***63042B2A";

const PAYLOAD_FIXO_CONVENIENCIA =
  "00020126580014BR.GOV.BCB.PIX0136081eacfb-5656-45e9-a87e-01eadfc58ced5204000053039865802BR5901N6001C62070503***63040024";

const PAYLOAD_FIXO_ESFIHARIA =
  "00020126580014BR.GOV.BCB.PIX01366dc25f05-2933-45f6-8018-3cee3149c4f55204000053039865802BR5901N6001C62070503***630418D5";

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

// hook simples para tamanho do QR responsivo (180–420px)
function useQrSize() {
  const [size, setSize] = useState(320);
  useEffect(() => {
    const compute = () => {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      // ocupa ~70% da largura em telas pequenas, com limites
      const newSize = Math.max(180, Math.min(420, Math.floor(vw * 0.7)));
      setSize(newSize);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return size;
}

const QrcodeShow: React.FC = () => {
  const { alias = "" } = useParams<{ alias: string }>();
  const aliasLc = alias?.toLowerCase?.() || "";
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrSize = useQrSize();

  const payload = useMemo(() => {
    if (aliasLc === "gil") return PAYLOAD_FIXO_GIL;
    if (aliasLc === "hamburgueria") return PAYLOAD_FIXO_HAMBURGUERIA;
    if (aliasLc === "conveniencia") return PAYLOAD_FIXO_CONVENIENCIA;
    if (aliasLc === "esfiharia") return PAYLOAD_FIXO_ESFIHARIA;
    return "";
  }, [aliasLc]);

  if (!payload) {
    return (
      <div className="page-hero" style={{ padding: "clamp(12px, 3vw, 24px)" }}>
        <div
          className="card small"
          style={{
            background: "rgba(255,255,255,.06)",
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: 20,
            padding: "clamp(18px, 3vw, 28px)",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <p style={{ marginBottom: 16, fontSize: "clamp(14px, 2.8vw, 16px)" }}>QR não encontrado.</p>
          <button
            className="btn-outline"
            onClick={() => navigate("/qrcode")}
            style={{
              background: "transparent",
              border: "1px solid #ffffff88",
              color: "#fff",
              padding: "10px 14px",
              borderRadius: 12,
              cursor: "pointer",
              fontSize: "clamp(14px, 2.8vw, 16px)",
            }}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrcode-${alias}.png`;
    a.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      alert("Copia e Cola copiado!");
    } catch {
      alert("Não foi possível copiar. Copie manualmente.");
    }
  };

  return (
    <div
      className="page-hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #0b1220, #0f172a)",
        color: "#fff",
        padding: "clamp(12px, 3vw, 24px)",
        textAlign: "center",
      }}
    >
      <div
        className="card"
        style={{
          background: "rgba(255,255,255,.06)",
          border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 20,
          padding: "clamp(18px, 3vw, 28px)",
          width: "100%",
          maxWidth: "min(820px, 94vw)",
          boxShadow: "0 10px 30px rgba(0,0,0,.35)",
        }}
      >
        <div
          className="card-toolbar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <button
            className="link"
            onClick={() => navigate("/qrcode")}
            style={{
              background: "transparent",
              border: "none",
              color: "#cbd5e1",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "clamp(14px, 2.8vw, 16px)",
            }}
            aria-label="Voltar"
          >
            ← Voltar
          </button>
          <span className="muted" style={{ color: "#cbd5e1", fontSize: "clamp(12px, 2.6vw, 14px)" }}>
            {cap(alias)}
          </span>
        </div>

        <h3 style={{ marginTop: 8, fontSize: "clamp(18px, 3.4vw, 22px)" }}>Escaneie o QR Code (PIX)</h3>

        {/* QR */}
        <div
          className="qr-wrap"
          style={{
            display: "grid",
            placeItems: "center",
            background: "#fff",
            padding: "clamp(10px, 2.4vw, 14px)",
            borderRadius: 16,
            boxShadow: "0 10px 24px rgba(0,0,0,.25)",
            width: "fit-content",
            margin: "12px auto 0",
          }}
        >
          <QRCodeCanvas value={payload} size={qrSize} level="H" includeMargin ref={canvasRef} />
        </div>

        {/* Copia e Cola */}
        <p
          className="muted"
          style={{
            wordBreak: "break-all",
            marginTop: 12,
            color: "#cbd5e1",
            fontSize: "clamp(12px, 2.6vw, 14px)",
          }}
        >
          <strong>Copia e Cola:</strong>
          <br />
          <code style={{ fontSize: "clamp(11px, 2.5vw, 13px)" }}>{payload}</code>
        </p>

        <div
          style={{
            display: "flex",
            gap: "clamp(6px, 2vw, 10px)",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn-outline"
            onClick={handleCopy}
            style={{
              background: "transparent",
              border: "1px solid #ffffff88",
              color: "#fff",
              padding: "clamp(8px, 2.2vw, 10px) clamp(12px, 2.5vw, 14px)",
              borderRadius: 12,
              cursor: "pointer",
              fontSize: "clamp(14px, 2.8vw, 16px)",
            }}
          >
            Copiar “Copia e Cola”
          </button>
          <button
            className="btn-outline"
            onClick={handleDownload}
            style={{
              background: "transparent",
              border: "1px solid #ffffff88",
              color: "#fff",
              padding: "clamp(8px, 2.2vw, 10px) clamp(12px, 2.5vw, 14px)",
              borderRadius: 12,
              cursor: "pointer",
              fontSize: "clamp(14px, 2.8vw, 16px)",
            }}
          >
            Baixar PNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrcodeShow;

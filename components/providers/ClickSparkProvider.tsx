"use client";

import { useEffect, useState } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
}

export default function ClickSparkProvider() {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't trigger on form inputs, textareas, etc.
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      const newSpark = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };

      setSparks((prev) => [...prev, newSpark]);

      // Remove spark after animation completes
      setTimeout(() => {
        setSparks((prev) => prev.filter((spark) => spark.id !== newSpark.id));
      }, 800);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="pointer-events-none fixed z-[9999]"
          style={{
            left: spark.x - 8,
            top: spark.y - 8,
          }}
        >
          {/* Multiple sparks radiating outward */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 360) / 12;
            const size = 2 + Math.random() * 2;
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, #E1F0C9 0%, #b8d89f 100%)`,
                  boxShadow: "0 0 6px #E1F0C9",
                  left: "8px",
                  top: "8px",
                  animation: `spark-out-${i % 8} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                  animationDelay: `${i * 0.03}s`,
                }}
              />
            );
          })}
          
          {/* Ring expansion */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              border: "2px solid #E1F0C9",
              animation: "ring-expand 0.6s ease-out forwards",
            }}
          />
          
          {/* Center glow */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #E1F0C9 0%, #b8d89f 50%, transparent 100%)",
              boxShadow: "0 0 16px #E1F0C9, 0 0 8px #E1F0C9",
              animation: "glow-out 0.6s ease-out forwards",
            }}
          />
        </div>
      ))}

      <style jsx global>{`
        @keyframes spark-out-0 {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(0, -35px);
            opacity: 0;
          }
        }
        @keyframes spark-out-1 {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(25px, -25px);
            opacity: 0;
          }
        }
        @keyframes spark-out-2 {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(35px, 0);
            opacity: 0;
          }
        }
        @keyframes spark-out-3 {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(25px, 25px);
            opacity: 0;
          }
        }
        @keyframes spark-out-4 {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(0, 35px);
            opacity: 0;
          }
        }
        @keyframes spark-out-5 {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(-25px, 25px);
            opacity: 0;
          }
        }
        @keyframes spark-out-6 {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(-35px, 0);
            opacity: 0;
          }
        }
        @keyframes spark-out-7 {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(-25px, -25px);
            opacity: 0;
          }
        }
        @keyframes ring-expand {
          0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 0;
          }
        }
        @keyframes glow-out {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

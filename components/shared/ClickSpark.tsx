"use client";

import { useEffect, useState } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
}

export default function ClickSpark() {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newSpark = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };

      setSparks((prev) => [...prev, newSpark]);

      // Remove spark after animation completes
      setTimeout(() => {
        setSparks((prev) => prev.filter((spark) => spark.id !== newSpark.id));
      }, 1000);
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
            left: spark.x,
            top: spark.y,
          }}
        >
          {/* Multiple sparks radiating outward */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8;
            const distance = 30 + Math.random() * 20;
            return (
              <div
                key={i}
                className="absolute animate-spark"
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, #E1F0C9 0%, #252F24 100%)`,
                  transform: `rotate(${angle}deg) translateX(0px)`,
                  animation: `spark-${i} 0.6s ease-out forwards`,
                  animationDelay: `${i * 0.02}s`,
                }}
              />
            );
          })}
        </div>
      ))}

      <style jsx>{`
        @keyframes spark-0 {
          to {
            transform: rotate(0deg) translateX(40px);
            opacity: 0;
          }
        }
        @keyframes spark-1 {
          to {
            transform: rotate(45deg) translateX(45px);
            opacity: 0;
          }
        }
        @keyframes spark-2 {
          to {
            transform: rotate(90deg) translateX(40px);
            opacity: 0;
          }
        }
        @keyframes spark-3 {
          to {
            transform: rotate(135deg) translateX(45px);
            opacity: 0;
          }
        }
        @keyframes spark-4 {
          to {
            transform: rotate(180deg) translateX(40px);
            opacity: 0;
          }
        }
        @keyframes spark-5 {
          to {
            transform: rotate(225deg) translateX(45px);
            opacity: 0;
          }
        }
        @keyframes spark-6 {
          to {
            transform: rotate(270deg) translateX(40px);
            opacity: 0;
          }
        }
        @keyframes spark-7 {
          to {
            transform: rotate(315deg) translateX(45px);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";

interface Trail {
  id: number;
  x: number;
  y: number;
}

export default function CursorTrail() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let lastTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const now = Date.now();
      // Throttle trail creation to every 50ms
      if (now - lastTime > 50) {
        const newTrail = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
        };

        setTrails((prev) => {
          const updated = [...prev, newTrail];
          // Keep only last 8 trails
          return updated.slice(-8);
        });

        lastTime = now;

        // Remove trail after fade
        setTimeout(() => {
          setTrails((prev) => prev.filter((trail) => trail.id !== newTrail.id));
        }, 800);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="pointer-events-none fixed z-[9998]"
          style={{
            left: trail.x - 3,
            top: trail.y - 3,
            opacity: (index + 1) / trails.length,
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #E1F0C9 0%, transparent 70%)",
              boxShadow: "0 0 8px rgba(225, 240, 201, 0.6)",
              animation: "trail-fade 0.8s ease-out forwards",
            }}
          />
        </div>
      ))}

      <style jsx global>{`
        @keyframes trail-fade {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

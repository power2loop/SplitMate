// Frontend/src/components/Clickme/Clickme.jsx
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function Clickme() {
    useEffect(() => {
        const duration = 6000; // 6 seconds
        const animationEnd = Date.now() + duration;
        const defaults = {
            startVelocity: 40,
            spread: 360,
            ticks: 80,
            zIndex: 9999,
            scalar: 1.8, // big pieces
        };

        const randomInRange = (min, max) =>
            Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 150 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0, 0.5), y: Math.random() - 0.2 },
                colors: ["#ff0000", "#00ff00", "#0000ff", "#ffcc00", "#ff69b4", "#00ffff"],
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.5, 1), y: Math.random() - 0.2 },
                colors: ["#ff0000", "#00ff00", "#0000ff", "#ffcc00", "#ff69b4", "#00ffff"],
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return null;
}

import { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";

export default function Canvas() {
    const containerRef = useRef(null);

    useEffect(() => {
        const setupCanvas = async () => {
            const app = new PIXI.Application();

            await app.init({
                width: 300,
                height: 300,
                background: "#1a1622",
            });

            const player = new PIXI.Graphics();

            player.circle(0, 0, 20);
            player.fill(0x3b82f6);

            player.x = 150;
            player.y = 150;

            app.stage.addChild(player);
            const otherUser = new PIXI.Graphics();

            otherUser.circle(0, 0, 20);
            otherUser.fill(0x22c55e);

            otherUser.x = 80;
            otherUser.y = 80;

            app.stage.addChild(otherUser);

            let isConnected = false;
            const checkProximity = () => {
                const dx = player.x - otherUser.x;
                const dy = player.y - otherUser.y;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 80 && !isConnected) {
                    isConnected = true;
                    console.log("connected");
                }

                if (distance >= 80 && isConnected) {
                    isConnected = false;
                    console.log("disconnected");
                }
            };

            window.addEventListener("keydown", (event) => {
                if ((event.key === "w" || event.key === "ArrowUp") && player.y > 20) {
                    player.y -= 10;
                }

                if ((event.key === "s" || event.key === "ArrowDown") && player.y < 280) {
                    player.y += 10;
                }

                if ((event.key === "a" || event.key === "ArrowLeft") && player.x > 20) {
                    player.x -= 10;
                }

                if ((event.key === "d" || event.key === "ArrowRight") && player.x < 280) {
                    player.x += 10;
                }

                checkProximity();
            });

            containerRef.current.innerHTML = "";
            containerRef.current.appendChild(app.canvas);
        };

        setupCanvas();
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: "300px",
                height: "300px",
                border: "2px solid white",
            }}
        ></div>
    );
}
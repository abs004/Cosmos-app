import { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";

export default function Canvas() {
    const containerRef = useRef(null);

    useEffect(() => {
        const setupCanvas = async () => {
            const app = new PIXI.Application();

            await app.init({
                width: 800,
                height: 600,
                background: "#1a1622",
            });

            const player = new PIXI.Graphics();
            player.circle(0, 0, 20);
            player.fill(0x3b82f6);
            player.x = 400;
            player.y = 300;

            const radiusZone = new PIXI.Graphics();

            radiusZone.circle(0, 0, 80);
            radiusZone.stroke({
                color: 0x3b82f6,
                width: 2,
                alpha: 0.4,
            });

            radiusZone.x = player.x;
            radiusZone.y = player.y;

            app.stage.addChild(radiusZone);
            app.stage.addChild(player);

            const otherUser = new PIXI.Graphics();
            otherUser.circle(0, 0, 20);
            otherUser.fill(0x22c55e);
            otherUser.x = 80;
            otherUser.y = 80;
            app.stage.addChild(otherUser);

            const statusText = new PIXI.Text({
                text: "DISCONNECTED",
                style: {
                    fill: "white",
                    fontSize: 16,
                },
            });

            statusText.x = 10;
            statusText.y = 10;
            app.stage.addChild(statusText);

            let isConnected = false;

            const checkProximity = () => {
                const dx = player.x - otherUser.x;
                const dy = player.y - otherUser.y;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 80 && !isConnected) {
                    isConnected = true;
                    statusText.text = "CONNECTED";
                }

                if (distance >= 80 && isConnected) {
                    isConnected = false;
                    statusText.text = "DISCONNECTED";
                }
            };

            window.addEventListener("keydown", (event) => {
                if ((event.key === "w" || event.key === "ArrowUp") && player.y > 20) {
                    player.y -= 10;
                }

                if ((event.key === "s" || event.key === "ArrowDown") && player.y < 580) {
                    player.y += 10;
                }

                if ((event.key === "a" || event.key === "ArrowLeft") && player.x > 20) {
                    player.x -= 10;
                }

                if ((event.key === "d" || event.key === "ArrowRight") && player.x < 780) {
                    player.x += 10;
                }

                radiusZone.x = player.x;
                radiusZone.y = player.y;

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
                width: "800px",
                height: "600px",
                border: "2px solid white",
                boxSizing: "border-box",
            }}
        ></div>
    );
}
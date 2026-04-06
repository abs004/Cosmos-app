import { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import socket from "../services/socket";

export default function Canvas({ setIsConnected, latestMessage }) {
  const containerRef = useRef(null);
  const bubbleTextRef = useRef(null);
  const otherPlayersRef = useRef({});
  const appRef = useRef(null);

  useEffect(() => {
    const handlePlayersUpdate = (players) => {
      const app = appRef.current;
      if (!app) return;

      Object.keys(otherPlayersRef.current).forEach((id) => {
        if (!players[id]) {
          app.stage.removeChild(otherPlayersRef.current[id]);
          delete otherPlayersRef.current[id];
        }
      });

      Object.entries(players).forEach(([id, position]) => {
        if (id === socket.id) return;

        if (!otherPlayersRef.current[id]) {
          const otherPlayer = new PIXI.Graphics();
          otherPlayer.circle(0, 0, 20);
          otherPlayer.fill(0x22c55e);

          otherPlayersRef.current[id] = otherPlayer;
          app.stage.addChild(otherPlayer);
        }

        otherPlayersRef.current[id].x = position.x;
        otherPlayersRef.current[id].y = position.y;
      });
    };

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("playersUpdate", handlePlayersUpdate);

    return () => {
      socket.off("playersUpdate", handlePlayersUpdate);
    };
  }, []);

  useEffect(() => {
    const setupCanvas = async () => {
      const app = new PIXI.Application();

      await app.init({
        width: 800,
        height: 600,
        background: "#1a1622",
      });

      appRef.current = app;

      const player = new PIXI.Graphics();
      player.circle(0, 0, 20);
      player.fill(0x3b82f6);
      player.x = 400;
      player.y = 300;

      const messageBubble = new PIXI.Graphics();
      messageBubble.roundRect(0, 0, 160, 40, 10);
      messageBubble.fill(0xffffff);
      messageBubble.x = player.x - 80;
      messageBubble.y = player.y - 70;

      app.stage.addChild(messageBubble);

      const bubbleText = new PIXI.Text({
        text: latestMessage,
        style: {
          fill: "black",
          fontSize: 14,
        },
      });

      bubbleText.x = messageBubble.x + 15;
      bubbleText.y = messageBubble.y + 10;

      bubbleTextRef.current = bubbleText;

      app.stage.addChild(bubbleText);

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
        let connected = false;

        Object.values(otherPlayersRef.current).forEach((otherPlayer) => {
          const dx = player.x - otherPlayer.x;
          const dy = player.y - otherPlayer.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            connected = true;
          }
        });

        if (connected && !isConnected) {
          isConnected = true;
          setIsConnected(true);
          statusText.text = "CONNECTED";
        }

        if (!connected && isConnected) {
          isConnected = false;
          setIsConnected(false);
          statusText.text = "DISCONNECTED";
        }
      };

      const keys = {};

      const onKeyDown = (event) => {
        keys[event.key] = true;
      };

      const onKeyUp = (event) => {
        keys[event.key] = false;
      };

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);

      app.ticker.add(() => {
        const speed = 5;
        let moved = false;

        if ((keys["w"] || keys["ArrowUp"]) && player.y > 20) {
          player.y -= speed;
          moved = true;
        }

        if ((keys["s"] || keys["ArrowDown"]) && player.y < 580) {
          player.y += speed;
          moved = true;
        }

        if ((keys["a"] || keys["ArrowLeft"]) && player.x > 20) {
          player.x -= speed;
          moved = true;
        }

        if ((keys["d"] || keys["ArrowRight"]) && player.x < 780) {
          player.x += speed;
          moved = true;
        }

        if (moved) {
          radiusZone.x = player.x;
          radiusZone.y = player.y;
          checkProximity();

          socket.emit("playerMove", {
            x: player.x,
            y: player.y,
          });
        }

        messageBubble.x = player.x - 80;
        messageBubble.y = player.y - 70;

        bubbleText.x = messageBubble.x + 15;
        bubbleText.y = messageBubble.y + 10;
      });

      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(app.canvas);

      return () => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        app.destroy(true, {
          children: true,
          texture: true,
          baseTexture: true,
        });
      };
    };

    const cleanup = setupCanvas();

    return () => {
      cleanup.then((destroy) => destroy && destroy());
    };
  }, [setIsConnected]);

  useEffect(() => {
    if (bubbleTextRef.current) {
      bubbleTextRef.current.text = latestMessage;
    }
  }, [latestMessage]);

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
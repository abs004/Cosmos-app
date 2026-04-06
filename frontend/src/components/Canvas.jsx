import { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import socket from "../services/socket";

export default function Canvas({ setIsConnected, latestMessage }) {
  const containerRef = useRef(null);
  const bubbleTextRef = useRef(null);
  const otherPlayersRef = useRef({});
  const appRef = useRef(null);
  const latestPlayersRef = useRef({});
  const messageBubbleRef = useRef(null);

  useEffect(() => {
    const handlePlayersUpdate = (players) => {
      latestPlayersRef.current = players;
      const app = appRef.current;
      if (!app) return;

      // Remove disconnected players
      Object.keys(otherPlayersRef.current).forEach((id) => {
        if (!players[id]) {
          const playerObj = otherPlayersRef.current[id];
          app.stage.removeChild(playerObj.sprite);
          app.stage.removeChild(playerObj.bubble);
          app.stage.removeChild(playerObj.bubbleText);
          delete otherPlayersRef.current[id];
        }
      });

      Object.entries(players).forEach(([id, position]) => {
        // Use a persistent socket ID from the connection if possible,
        // or check against the current socket.id directly.
        if (socket.id && id === socket.id) return;

        // Create player if not exists
        if (!otherPlayersRef.current[id]) {
          const sprite = new PIXI.Graphics();
          sprite.circle(0, 0, 20);
          sprite.fill(0x22c55e);

          const bubble = new PIXI.Graphics();
          bubble.roundRect(0, 0, 140, 35, 8);
          bubble.fill(0xffffff);
          bubble.visible = false;

          const bubbleText = new PIXI.Text({
            text: "",
            style: {
              fill: "black",
              fontSize: 12,
            },
          });
          bubbleText.visible = false;

          app.stage.addChild(sprite);
          app.stage.addChild(bubble);
          app.stage.addChild(bubbleText);

          otherPlayersRef.current[id] = {
            sprite,
            bubble,
            bubbleText,
          };
        }

        const playerObj = otherPlayersRef.current[id];

        // Move player
        playerObj.sprite.x = position.x;
        playerObj.sprite.y = position.y;

        // Move bubble with player
        if (position.message) {
          playerObj.bubble.visible = true;
          playerObj.bubbleText.visible = true;

          playerObj.bubble.x = position.x - 70;
          playerObj.bubble.y = position.y - 60;

          playerObj.bubbleText.text = position.message;
          playerObj.bubbleText.x = position.x - 55;
          playerObj.bubbleText.y = position.y - 50;
        } else {
          playerObj.bubble.visible = false;
          playerObj.bubbleText.visible = false;
        }
      });
    };

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      // Ensure we trigger a move update on connect to tell the server our initial pos
      socket.emit("playerMove", { x: 400, y: 300 });
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

      // Apply initial state if already received
      if (latestPlayersRef.current) {
        // We trigger an update manually because handlePlayersUpdate might have returned early
        // since appRef.current was null before this line.
        socket.emit("playerMove", { x: 400, y: 300 });
      }

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
      messageBubble.visible = false; // Hide by default

      app.stage.addChild(messageBubble);

      const bubbleText = new PIXI.Text({
        text: "",
        style: {
          fill: "black",
          fontSize: 14,
        },
      });

      bubbleText.x = messageBubble.x + 15;
      bubbleText.y = messageBubble.y + 10;
      bubbleText.visible = false; // Hide by default

      bubbleTextRef.current = bubbleText;
      messageBubbleRef.current = messageBubble;

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

      let isConnectedInternal = false;

      const checkProximity = () => {
        let connected = false;

        Object.values(otherPlayersRef.current).forEach((otherPlayer) => {
          // Fix: otherPlayer is a wrapper object, we need to access the sprite's position
          const dx = player.x - otherPlayer.sprite.x;
          const dy = player.y - otherPlayer.sprite.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            connected = true;
          }
        });

        if (connected && !isConnectedInternal) {
          isConnectedInternal = true;
          setIsConnected(true);
          statusText.text = "CONNECTED";
        }

        if (!connected && isConnectedInternal) {
          isConnectedInternal = false;
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
    if (!bubbleTextRef.current || !messageBubbleRef.current || !latestMessage) return;

    if (latestMessage.senderId === socket.id) {
      bubbleTextRef.current.text = latestMessage.text;
      bubbleTextRef.current.visible = true;
      messageBubbleRef.current.visible = true;

      // Optional: hide after 5 seconds
      const timeout = setTimeout(() => {
        bubbleTextRef.current.visible = false;
        messageBubbleRef.current.visible = false;
      }, 5000);

      return () => clearTimeout(timeout);
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
import { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import socket from "../services/socket";

export default function Canvas({ setIsConnected, latestMessage, username, players }) {
  const containerRef = useRef(null);
  const playerSpritesRef = useRef({});
  const appRef = useRef(null);

  const handlePlayersUpdate = (playersData) => {
    const app = appRef.current;
    if (!app) return;

    // Remove disconnected players
    Object.keys(playerSpritesRef.current).forEach((id) => {
      if (!playersData[id]) {
        const playerObj = playerSpritesRef.current[id];
        app.stage.removeChild(playerObj.sprite);
        app.stage.removeChild(playerObj.nameText);
        app.stage.removeChild(playerObj.bubble);
        app.stage.removeChild(playerObj.bubbleText);
        delete playerSpritesRef.current[id];
      }
    });

    Object.entries(playersData).forEach(([id, position]) => {
      const isLocal = socket.id && id === socket.id;

      // Create sprite if not exists
      if (!playerSpritesRef.current[id]) {
        const sprite = new PIXI.Graphics();
        sprite.circle(0, 0, 20);
        sprite.fill(isLocal ? 0x3b82f6 : 0x22c55e);

        const nameText = new PIXI.Text({
          text: position.name || "User",
          style: {
            fill: "white",
            fontSize: 12,
            fontWeight: "bold",
          },
        });
        nameText.anchor.set(0.5, 0);

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
        app.stage.addChild(nameText);
        app.stage.addChild(bubble);
        app.stage.addChild(bubbleText);

        playerSpritesRef.current[id] = {
          sprite,
          nameText,
          bubble,
          bubbleText,
        };
      }

      const playerObj = playerSpritesRef.current[id];

      // Update position
      playerObj.sprite.x = position.x;
      playerObj.sprite.y = position.y;
      playerObj.nameText.text = position.name || "User";
      playerObj.nameText.x = position.x;
      playerObj.nameText.y = position.y + 25;

      // In-engine bubble logic (synced with movement if any)
      if (position.message) {
        playerObj.bubble.visible = true;
        playerObj.bubbleText.visible = true;
        playerObj.bubble.x = position.x - 70;
        playerObj.bubble.y = position.y - 60;
        playerObj.bubbleText.text = position.message;
        playerObj.bubbleText.x = position.x - 55;
        playerObj.bubbleText.y = position.y - 50;
      }
    });
  };

  useEffect(() => {
    handlePlayersUpdate(players);
  }, [players]);

  useEffect(() => {
    socket.on("connect", () => {
      if (username) {
        socket.emit("joinUser", { name: username });
      }
      socket.emit("playerMove", { x: 400, y: 300 });
    });

    return () => {
      socket.off("connect");
    };
  }, [username]);

  useEffect(() => {
    const setupCanvas = async () => {
      const app = new PIXI.Application();
      await app.init({
        width: 800,
        height: 600,
        background: "#1a1622",
      });

      appRef.current = app;

      const keys = {};
      const onKeyDown = (e) => (keys[e.key] = true);
      const onKeyUp = (e) => (keys[e.key] = false);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);

      const statusText = new PIXI.Text({
        text: "DISCONNECTED",
        style: { fill: "white", fontSize: 16 },
      });
      statusText.x = 10;
      statusText.y = 10;
      app.stage.addChild(statusText);

      let isConnectedInternal = false;

      const checkProximity = (localPos) => {
        let connected = false;
        if (!localPos) return;

        Object.entries(playerSpritesRef.current).forEach(([id, otherPlayer]) => {
          if (id === socket.id) return;
          const dx = localPos.x - otherPlayer.sprite.x;
          const dy = localPos.y - otherPlayer.sprite.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 80) connected = true;
        });

        if (connected && !isConnectedInternal) {
          isConnectedInternal = true;
          setIsConnected(true);
          statusText.text = "CONNECTED";
        } else if (!connected && isConnectedInternal) {
          isConnectedInternal = false;
          setIsConnected(false);
          statusText.text = "DISCONNECTED";
        }
      };

      app.ticker.add(() => {
        const local = playerSpritesRef.current[socket.id];
        if (!local) return;

        const speed = 5;
        let moved = false;

        if ((keys["w"] || keys["ArrowUp"]) && local.sprite.y > 20) {
          local.sprite.y -= speed;
          moved = true;
        }
        if ((keys["s"] || keys["ArrowDown"]) && local.sprite.y < 580) {
          local.sprite.y += speed;
          moved = true;
        }
        if ((keys["a"] || keys["ArrowLeft"]) && local.sprite.x > 20) {
          local.sprite.x -= speed;
          moved = true;
        }
        if ((keys["d"] || keys["ArrowRight"]) && local.sprite.x < 780) {
          local.sprite.x += speed;
          moved = true;
        }

        if (moved) {
          local.nameText.x = local.sprite.x;
          local.nameText.y = local.sprite.y + 25;
          checkProximity({ x: local.sprite.x, y: local.sprite.y });
          socket.emit("playerMove", { x: local.sprite.x, y: local.sprite.y });
        }
      });

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(app.canvas);
      }

      return () => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        app.destroy(true, { children: true, texture: true });
      };
    };

    const cleanup = setupCanvas();
    return () => {
      cleanup.then((destroyFn) => destroyFn && destroyFn());
    };
  }, [setIsConnected, username]);

  useEffect(() => {
    if (!latestMessage) return;
    const playerObj = playerSpritesRef.current[latestMessage.senderId];
    if (playerObj) {
      playerObj.bubbleText.text = latestMessage.text;
      playerObj.bubbleText.visible = true;
      playerObj.bubble.visible = true;
      const timeout = setTimeout(() => {
        playerObj.bubbleText.visible = false;
        playerObj.bubble.visible = false;
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

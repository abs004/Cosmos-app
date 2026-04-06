import { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import socket from "../services/socket";
import bgImage from "../assets/bkground.jpg";
import { createAvatar } from "@dicebear/core";
import * as adventurer from "@dicebear/adventurer";

export default function Canvas({ setIsConnected, latestMessage, username, players, setIsLoading }) {
  const containerRef = useRef(null);
  const playerSpritesRef = useRef({});
  const appRef = useRef(null);

  const handlePlayersUpdate = (playersData) => {
    const app = appRef.current;
    if (!app) return;

    // Check if local player exists now
    if (socket.id && playersData[socket.id]) {
      setIsLoading(false);
    }

    // Remove disconnected players
    Object.keys(playerSpritesRef.current).forEach((id) => {
      if (!playersData[id]) {
        const playerObj = playerSpritesRef.current[id];
        app.stage.removeChild(playerObj.sprite);
        app.stage.removeChild(playerObj.radiusGraphics);
        app.stage.removeChild(playerObj.nameText);
        app.stage.removeChild(playerObj.bubble);
        app.stage.removeChild(playerObj.bubbleText);
        delete playerSpritesRef.current[id];
      }
    });

    Object.entries(playersData).forEach(([id, position]) => {
      const isLocal = socket.id && id === socket.id;

      // Create sprite/graphics if not exists
      if (!playerSpritesRef.current[id]) {
        // Start with a fallback circle
        const sprite = new PIXI.Graphics();
        sprite.circle(0, 0, 20);
        sprite.fill(isLocal ? 0x3b82f6 : 0x22c55e);

        const avatarSeed = position.avatarSeed || position.name || "default";

        // Generate local data URI
        const avatarUri = createAvatar(adventurer, {
          seed: avatarSeed,
        }).toDataUri();

        // Async load avatar
        PIXI.Assets.load(avatarUri).then((texture) => {
          if (playerSpritesRef.current[id]) {
            const avatarSprite = new PIXI.Sprite(texture);
            avatarSprite.anchor.set(0.5);
            avatarSprite.width = 60;
            avatarSprite.height = 60;

            const oldSprite = playerSpritesRef.current[id].sprite;
            const parent = oldSprite.parent;
            if (parent) {
              const index = parent.getChildIndex(oldSprite);
              parent.removeChild(oldSprite);
              parent.addChildAt(avatarSprite, index);
            }
            playerSpritesRef.current[id].sprite = avatarSprite;
            playerSpritesRef.current[id].hasAvatar = true;

            avatarSprite.x = oldSprite.x;
            avatarSprite.y = oldSprite.y;
          }
        }).catch(err => console.error("Avatar load failed:", err));

        const nameText = new PIXI.Text({
          text: position.name || "User",
          style: {
            fill: "white",
            fontSize: 12,
            fontWeight: "bold",
          },
        });
        nameText.anchor.set(0.5, 0);

        // ... rest of the creation logic ...
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

        const radiusGraphics = new PIXI.Graphics();
        radiusGraphics.circle(0, 0, 80);
        radiusGraphics.fill({ color: 0xffffff, alpha: 0.05 });
        radiusGraphics.stroke({ width: 1, color: 0xffffff, alpha: 0.1 });
        app.stage.addChildAt(radiusGraphics, 1); // Above background, below players

        app.stage.addChild(sprite);
        app.stage.addChild(nameText);
        app.stage.addChild(bubble);
        app.stage.addChild(bubbleText);

        playerSpritesRef.current[id] = {
          sprite,
          radiusGraphics,
          nameText,
          bubble,
          bubbleText,
          hasAvatar: !!position.avatarSeed
        };
      }

      const playerObj = playerSpritesRef.current[id];

      // Update position
      playerObj.sprite.x = position.x;
      playerObj.sprite.y = position.y;
      playerObj.radiusGraphics.x = position.x;
      playerObj.radiusGraphics.y = position.y;
      playerObj.nameText.text = position.name || "User";
      playerObj.nameText.x = position.x;
      playerObj.nameText.y = position.y + 25;

      // Update bubble position if visible
      playerObj.bubble.x = position.x - 70;
      playerObj.bubble.y = position.y - 60;
      playerObj.bubbleText.x = position.x - (playerObj.bubbleText.width / 2);
      playerObj.bubbleText.y = position.y - 50;
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

      // Ensure canvas is in DOM immediately so we don't have a blank screen during loading
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(app.canvas);
      }

      // Load Background (Non-blocking)
      const loadBackground = async () => {
        try {
          const bgTexture = await PIXI.Assets.load(bgImage);
          const bgSprite = new PIXI.Sprite(bgTexture);
          bgSprite.width = 800;
          bgSprite.height = 600;
          app.stage.addChildAt(bgSprite, 0); // Always at bottom
        } catch (error) {
          console.error("Failed to load background image:", error);
        }
      };
      loadBackground();

      const keys = {};
      const onKeyDown = (e) => (keys[e.key] = true);
      const onKeyUp = (e) => (keys[e.key] = false);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);

      const promptText = new PIXI.Text({
        text: "",
        style: { fill: "#fbbf24", fontSize: 18, fontWeight: "bold", stroke: "black", strokeThickness: 2 },
      });
      promptText.anchor.set(0.5);
      promptText.visible = false;
      app.stage.addChild(promptText);

      let isConnectedInternal = false;
      let closestPlayerId = null;

      const checkProximity = (localPos) => {
        let nearest = null;
        let minDistance = 80;

        Object.entries(playerSpritesRef.current).forEach(([id, otherPlayer]) => {
          if (id === socket.id) return;
          const dx = localPos.x - otherPlayer.sprite.x;
          const dy = localPos.y - otherPlayer.sprite.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < minDistance) {
            minDistance = distance;
            nearest = id;
          }
        });

        if (nearest && !isConnectedInternal) {
          closestPlayerId = nearest;
          const target = playerSpritesRef.current[nearest];
          promptText.text = `Press E to chat with ${target.nameText.text}`;
          promptText.x = localPos.x;
          promptText.y = localPos.y - 60;
          promptText.visible = true;
        } else {
          closestPlayerId = null;
          promptText.visible = false;

          // Auto-disconnect if we were connected and moved away
          if (isConnectedInternal) {
            isConnectedInternal = false;
            setIsConnected(false);
          }
        }
      };

      app.ticker.add(() => {
        // Suppress movement if user is typing in any input field
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

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

          // Update bubble position
          local.bubble.x = local.sprite.x - 70;
          local.bubble.y = local.sprite.y - 60;
          local.bubbleText.x = local.sprite.x - (local.bubbleText.width / 2);
          local.bubbleText.y = local.sprite.y - 50;

          checkProximity({ x: local.sprite.x, y: local.sprite.y });
          socket.emit("playerMove", { x: local.sprite.x, y: local.sprite.y });
        }

        // Connection intent
        if ((keys["e"] || keys["E"]) && closestPlayerId && !isConnectedInternal) {
          isConnectedInternal = true;
          setIsConnected(closestPlayerId);
          promptText.visible = false; // Hide prompt once connected
        }
      });

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
      const displayMsg = latestMessage.text.length > 20
        ? latestMessage.text.substring(0, 17) + "..."
        : latestMessage.text;

      playerObj.bubbleText.text = displayMsg;
      playerObj.bubbleText.visible = true;
      playerObj.bubble.visible = true;

      // Update bubble position
      playerObj.bubble.x = playerObj.sprite.x - 70;
      playerObj.bubble.y = playerObj.sprite.y - 60;

      // Update bubble text position to center within the bubble
      playerObj.bubbleText.x = playerObj.sprite.x - (playerObj.bubbleText.width / 2);
      playerObj.bubbleText.y = playerObj.sprite.y - 50;

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
        borderRadius: "12px",
        overflow: "hidden",
      }}
    ></div>
  );
}
import "./App.css";
import Canvas from "./components/Canvas";

export default function App() {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#d1d5db",
        overflow: "hidden",
      }}
    >
      <Canvas />
    </div>
  );
}
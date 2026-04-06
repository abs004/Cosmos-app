import socket from "../services/socket";

export default function UserList({ players }) {
    return (
        <div
            style={{
                width: "250px",
                height: "600px",
                backgroundColor: "#111827",
                color: "white",
                padding: "20px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                borderRight: "2px solid white",
            }}
        >
            <h2 style={{ marginBottom: "20px", fontSize: "1.2rem" }}>Online Users</h2>

            <div style={{ flex: 1, overflowY: "auto" }}>
                {Object.entries(players).map(([id, player]) => (
                    <div
                        key={id}
                        style={{
                            padding: "10px",
                            marginBottom: "8px",
                            backgroundColor: id === socket.id ? "#1e293b" : "#1f2937",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <div
                            style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: "#22c55e",
                            }}
                        />
                        <span>{player.name || "Joining..."} {id === socket.id ? "(You)" : ""}</span>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "20px", fontSize: "0.8rem", color: "#94a3b8" }}>
                {Object.keys(players).length} Users Online
            </div>
        </div>
    );
}

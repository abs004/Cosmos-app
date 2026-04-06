export default function LoadingSpinner() {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "#111827",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                color: "white",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <div
                style={{
                    width: "50px",
                    height: "50px",
                    border: "5px solid rgba(255, 255, 255, 0.1)",
                    borderTop: "5px solid #3b82f6",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    marginBottom: "20px",
                }}
            />
            <p style={{ fontSize: "1.2rem", fontWeight: "500", letterSpacing: "1px" }}>
                INITIALIZING COSMOS...
            </p>

            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}

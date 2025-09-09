import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "10px",
        background: "#f0f0f0",
        borderBottom: "1px solid #ddd"
      }}>
        <button onClick={logout} style={{ padding: "5px 15px" }}>
          Logout
        </button>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <h2>Welcome {user?.username || "User"} 🎉</h2>
      </div>
    </div>
  );
}

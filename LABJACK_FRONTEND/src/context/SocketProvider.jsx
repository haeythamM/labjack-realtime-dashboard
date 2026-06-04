import { createContext, useContext, useEffect, useMemo } from "react";
import { socket as sharedSocket } from "../lib/socket";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socket = useMemo(() => sharedSocket, []);

  useEffect(() => {
    if (!socket) {
      console.error("VITE_API_BASE is missing. Socket is not initialized.");
      return;
    }

    const onConnect = () => console.log("✅ Socket connected:", socket.id);
    const onDisconnect = (reason) => console.log("⚠️ Socket disconnected:", reason);
    const onConnectError = (err) => console.log("❌ Socket connect error:", err.message);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    // Do NOT disconnect here — this provider stays mounted while the app runs.
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, [socket]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const subscribersRef = useRef({});

  useEffect(() => {
    if (!user) {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
        setConnected(false);
      }
      return;
    }

    const token = localStorage.getItem("token");
    const wsUrl = import.meta.env.VITE_WS_URL || "/ws";

    const client = new Client({
      // Use brokerURL for native WebSocket (works in modern browsers without SockJS)
      brokerURL: wsUrl.startsWith("ws") ? wsUrl : undefined,
      // Fall back to SockJS factory if the URL is a relative path
      webSocketFactory: wsUrl.startsWith("ws")
        ? undefined
        : () => {
            // Dynamic import of SockJS to avoid ESM issues
            const SockJSConstructor = window.SockJS;
            if (SockJSConstructor) return new SockJSConstructor(wsUrl);
            // Fallback: use native WebSocket on relative path
            const absoluteUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}${wsUrl}`;
            return new WebSocket(absoluteUrl);
          },
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        // Re-subscribe to all saved subscriptions
        Object.entries(subscribersRef.current).forEach(([dest, cb]) => {
          try {
            client.subscribe(dest, cb);
          } catch (e) {
            console.warn("Failed to re-subscribe to", dest, e);
          }
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        setConnected(false);
      },
      onWebSocketError: (error) => {
        console.warn("WebSocket error (will retry):", error);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [user?.id]);

  const subscribe = (destination, callback) => {
    subscribersRef.current[destination] = callback;
    if (clientRef.current?.connected) {
      return clientRef.current.subscribe(destination, callback);
    }
    return { unsubscribe: () => { delete subscribersRef.current[destination]; } };
  };

  const publish = (destination, body) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    }
  };

  return (
    <SocketContext.Provider value={{ connected, subscribe, publish }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used inside SocketProvider");
  return context;
};

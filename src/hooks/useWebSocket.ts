import { useEffect, useCallback, useRef } from "react";
import { websocketService } from "../services/websocketService";
import { WebSocketMessage } from "../types/api";

type WebSocketEventHandler = (data: any) => void;

export const useWebSocket = () => {
  const handlersRef = useRef<Map<string, WebSocketEventHandler[]>>(new Map());

  // Initialize WebSocket connection
  useEffect(() => {
    const connect = async () => {
      try {
        await websocketService.connect();
        console.log("WebSocket connected successfully");
      } catch (error) {
        console.error("Failed to connect to WebSocket:", error);
      }
    };

    connect();

    // Cleanup on unmount
    return () => {
      websocketService.disconnect();
    };
  }, []);

  // Subscribe to WebSocket events
  const subscribe = useCallback(
    (action: string, handler: WebSocketEventHandler) => {
      // Keep track of handlers for cleanup
      if (!handlersRef.current.has(action)) {
        handlersRef.current.set(action, []);
      }
      handlersRef.current.get(action)!.push(handler);

      // Subscribe to the service
      websocketService.on(action, handler);

      // Return unsubscribe function
      return () => {
        websocketService.off(action, handler);

        // Remove from our tracking
        const handlers = handlersRef.current.get(action);
        if (handlers) {
          const index = handlers.indexOf(handler);
          if (index !== -1) {
            handlers.splice(index, 1);
          }
        }
      };
    },
    []
  );

  // Send message through WebSocket
  const sendMessage = useCallback((message: WebSocketMessage) => {
    websocketService.send(message);
  }, []);

  // Get connection status
  const isConnected = useCallback(() => {
    return websocketService.isConnected();
  }, []);

  // Cleanup all handlers on unmount
  useEffect(() => {
    return () => {
      // Unsubscribe all handlers
      handlersRef.current.forEach((handlers, action) => {
        handlers.forEach((handler) => {
          websocketService.off(action, handler);
        });
      });
      handlersRef.current.clear();
    };
  }, []);

  return {
    subscribe,
    sendMessage,
    isConnected,
  };
};

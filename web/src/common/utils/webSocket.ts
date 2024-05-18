import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface WebSocketState {
  socket: Socket | null;
  isConnected: boolean;
  connectWebSocket: (token: string) => void;
  disconnectWebSocket: () => void;
}

export const useWebSocket = create<WebSocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  connectWebSocket: (token: string) => {
    if (get().isConnected) {
      console.log('WebSocket is already connected.');
      return;
    }

    const socket = io(
      `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_CHAT_SOCKET_PORT}`,
      {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    set({ socket, isConnected: true });
  },

  disconnectWebSocket: () => {
    if (get().socket) {
      get().socket?.disconnect();
      console.log('Disconnecting WebSocket...');
    }
    set({ socket: null, isConnected: false });
  },
}));

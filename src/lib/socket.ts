import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://api.esperanzalaguna.com', {
      transports: ['websocket'],
      // El backend solo deja entrar a la sala del taller con un token de personal
      auth: (cb) => cb({ token: typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null }),
      autoConnect: true,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

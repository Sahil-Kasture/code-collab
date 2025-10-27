import {io} from 'socket.io-client';

const BACKEND_URL = `https://server-p9j7.onrender.com/`;
let socket = io(BACKEND_URL, {
    transports: ['websocket'],
    auth: { token: localStorage.getItem('token') },
});

export default socket;

export const checkRoom = async (roomId)=>{
  const response = await fetch(`${BACKEND_URL}/checkRoom`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({roomId})
  })
  const data = await response.json()
  return data.exists
}

export function emitAsync(event, data) {
  return new Promise((resolve, reject) => {
    socket.emit(event, data, (response) => {
      if (response?.success) resolve(response);
      else reject(response);
    });
  });
}
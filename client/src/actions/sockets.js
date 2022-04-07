// import io from 'socket.io-client';
// let socket;
// const ENDPOINT = 'http://localhost:5000';


// export const initiateSocket = async (idNotifications) => {
//   socket =  io(ENDPOINT) 
//       let data = {username: idNotifications}
//    socket.emit('setUser', data);

// }
// export const matchCreated = (homeTeam, awayTeam) =>{
//   const players = [...homeTeam, ...awayTeam];
//    socket.emit('players', players)
// }

// export const disconnectSocket = () => {
//   console.log('Disconnecting socket...');
//   if(socket) socket.disconnect();
// }
// export const subscribeToChat = (cb) => {
//   if (!socket) return(true);
//   socket.on('chat', msg => {
//     console.log('Websocket event received!');
   
//     return cb(null, msg);
//   });
// }
// export const sendMessage = (room, message,user) => {
//   if (socket) socket.emit('chat', { message, room,user });
// }

// export const getOldMessages = (cb) =>{
//     socket.on('oldchat', chat =>{
//         console.log(chat,'chat')
//         return cb(null, chat)
//     })
// }

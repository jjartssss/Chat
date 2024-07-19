import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Message from './Message';

// const socket = io("http://localhost:3001"); //https://testserver-aptd.onrender.com
const socket = io("https://testserver-aptd.onrender.com");
const Room = () => {
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState("");
  const {playerName} = useParams();
  const location = useLocation();
  const {name, room} = location.state || {};
  const [messageList, setMessageList] = useState([]);
const messagesEndRef = useRef(null);
  useEffect(() => {
  // Join the room when component mounts
  if (room) {
    socket.emit('join_room', room);
    console.log(`Joined room: ${room}`);
  }

  // Handle new player joining the room
  socket.on('add_players', (player) => {
    console.log('Player added:', player); // Debugging
    setPlayers((prevPlayers) => [...prevPlayers, player]);
  });

  // Handle initial list of players when joining the room
  socket.on('initial_players_list', (playersList) => {
    console.log('Initial players list:', playersList); // Debugging
    setPlayers(playersList);
  });

  // Handle player removal
  socket.on('remove_player', (data) => {
    console.log('Player removed:', data); // Debugging
    setPlayers((prevPlayers) => prevPlayers.filter(player => player.id !== data.id));
  });

  // Handle player update
  socket.on('update_position', (playersList) => {
    console.log('Initial players list:', playersList); // Debugging
    setMessage(playersList);
  });

  // Handle Messages
  socket.on('update_message', (data) => {
    console.log('Message received:', data); // Debugging
    setMessageList(prev => [...prev, data]);
  });

  // Cleanup listeners on component unmount
  return () => {
    socket.off('add_players');
    socket.off('initial_players_list');
    socket.off('remove_player');
    socket.off('update_message');
  };
}, [room]);

  // Log the updated message list when it changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messageList]);

  const sendMessage = () => {
      if (room && message.trim()) {
          socket.emit("send_message", { name, message, room });
          setMessage("");
      }
  };

  return (
    <div className='flex w-full justify-center items-center h-screen bg-blue-900'>
      {players.length > 0 ? (
        players.map((player) => (
          <div key={player.id} id={player.id} style={{ position: 'absolute', top: player.position.top, left: player.position.left }} className='flex justify-center w-[50px] h-[80px] bg-white'>
            <p className='-mt-10 text-white'>{player.name}</p>
          </div>
        ))
      ) : (
        <p>No players available</p>
      )}
      <div className=' absolute bottom-0 w-[500px] p-5 h-[20%] mb-5 rounded-lg bg-white'>
        <textarea value={message} onChange={(event) => {setMessage(event.target.value)}} className='resize-none h-[60%] w-full border-2 p-2' placeholder='Message here'></textarea>
        <button onClick={sendMessage} className='w-full bg-blue-500 text-white p-5'>SEND</button>
      </div>
      <div className='absolute right-0 w-[25%] h-full bg-white'>
        <div className='w-full  flex justify-center items-center p-2 text-2xl bg-blue-500 text-white'>Room: {room}</div>
        <div className='flex h-[90%] flex-col p-5 gap-y-5 overflow-y-scroll'>
          {
            messageList ? messageList.map((message, index)=>(
              <Message key={index} name={message.name} message={message.message} isOther={name === message.name ? false : true}></Message>
            ))
            : <p>No messages at the moment</p>
          }
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default Room;

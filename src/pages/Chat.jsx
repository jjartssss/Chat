import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'


const socket = io.connect("https://testserver-aptd.onrender.com")

const Chat = () => {
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");
    const [messageList, setMessageList] = useState("");
    const sendMessage = () => {
        socket.emit("send_message", {message, room});
    }

    const joinRoom = () => {
        socket.emit("join_room", room);
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList(data.message);
        })
    },[socket])

  return (
    <div className='w-full flex-col h-screen bg-slate-200 gap-y-5 flex justify-center items-center'>
        <div>
            <input className='p-5 ' value={room} onChange={(event) => {setRoom(event.target.value)} } placeholder='Room'></input>
            <button onClick={joinRoom} className='p-5 bg-red-500 text-white'>JOIN</button>
        </div>
        
        <div>
            <input className='p-5 ' value={message} onChange={(event) => {setMessage(event.target.value)} } placeholder='Message...'></input>
        <button onClick={sendMessage} className='p-5 bg-blue-400 text-white'>SEND</button>
        </div>
        <div className='border-2 border-black p-10'>
            <p>Messages</p>
            {
                messageList
            }
        </div>
        

    </div>
  )
}

export default Chat
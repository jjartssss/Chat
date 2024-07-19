import React, { useState } from 'react'
import io from 'socket.io-client'
import { useNavigate } from 'react-router-dom';

// const socket = io.connect("http://localhost:3001");
const socket = io("https://testserver-aptd.onrender.com");
const Home = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");

    const joinMainRoom = () => {
        const data = { name: name, room: 100};
        socket.emit("join_main_room", data);
        navigate('/mainroom', {state: data});
    }

    const test = () => {
        socket.emit("send_test", "bobo");
    }

    return (
    <div className='flex justify-center items-center w-full h-screen bg-blue-950'>
        <div className='flex flex-col gap-y-5 w-fit h-fit bg-white px-10 py-5 rounded-lg'>
            <input autoFocus value={name} onChange={(event)=> {setName(event.target.value)}} className='w-full p-5 text-center border-2' placeholder='Input your name'></input>
               <button onClick={joinMainRoom} className='w-full bg-blue-500 text-white p-5'>JOIN</button> 
        </div>

    </div>
  )
}

export default Home
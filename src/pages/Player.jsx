import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

// Connect to the Socket.IO server
// const socket = io("http://localhost:3001");
const socket = io("https://testserver-aptd.onrender.com");
const Player = ({ name, xpos, ypos, id }) => {
  const [position, setPosition] = useState({ top: ypos, left: xpos });
  const draggingRef = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  // Handle mouse down event to start dragging
  const handleMouseDown = (event) => {
    draggingRef.current = true;
    startX.current = event.clientX - position.left;
    startY.current = event.clientY - position.top;
  };

  // Handle mouse move event to update position while dragging
  const handleMouseMove = (event) => {
    if (draggingRef.current) {
      const newTop = event.clientY - startY.current;
      const newLeft = event.clientX - startX.current;
      setPosition({ top: newTop, left: newLeft });

      // Send the updated position to the server
      socket.emit('update_position', { id, top: newTop, left: newLeft });
    }
  };

  // Handle mouse up event to stop dragging
  const handleMouseUp = () => {
    draggingRef.current = false;
  };

  useEffect(() => {
    // Attach event listeners for mouse move and mouse up
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Clean up event listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Listen for position updates from the server
  useEffect(() => {
    socket.on('position_update', (data) => {
      if (data.id !== id) {
        // Update other clients' positions
        setPosition({ top: data.top, left: data.left });
      }
    });

    return () => {
      socket.off('position_update');
    };
  }, [id]);

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        cursor: 'pointer',
        top: position.top,
        left: position.left,
        position: 'absolute',
        backgroundColor: 'white',
        width: '50px',
        height: '80px',
        textAlign: 'center',
      }}
      className='flex justify-center'
    >
      <p className='-mt-10 text-white'>{name}</p>
    </div>
  );
};

export default Player;

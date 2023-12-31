import React from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import { useEffect } from 'react'
import { io } from 'socket.io-client' 
import { SERVER_URL } from '../config/config'

export const SocketContainerContext= createContext()
const SocketContainer = ({children}) => {
  const [socketState, setSocketState]= useState()
  const [meSocket, setMeSocket]= useState("")
  useEffect(()=> {
    const socket= io(`${SERVER_URL}`, [{transports: ["websocket"]}])
    // socket.emit("join_room_self", {data: localStorage.getItem("uid")})
    socket.on("me", (id)=> {
      setMeSocket(id)
    })
    setSocketState(socket)
    socket.on("disconnect", handleDisconnect);
    return ()=> socket.disconnect()
  }, [])
  
  const handleDisconnect = () => {
    console.log("Socket disconnected. Reconnecting...");
    const socket= io(`${SERVER_URL}`, [{transports: ["websocket"]}])
    // socket.emit("join_room_self", {data: localStorage.getItem("uid")})
    socket.on("me", (id)=> {
      setMeSocket(id)
    })
    setSocketState(socket)
  };

  return (
    <SocketContainerContext.Provider value={{socketState, meSocket}}>
        {children}
    </SocketContainerContext.Provider>
  )
}

export default SocketContainer
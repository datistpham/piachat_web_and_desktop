// import Cookies from "js-cookie";
import React, { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../../App";
import { SocketContainerContext } from "../../SocketContainer/SocketContainer";
import InComingCall from "../InComingCall/InComingCall";
import MainScreen from "./MainScreen";
import Profile from "./Profile";
import { Route, Routes, useNavigate } from "react-router-dom";
// import VideoChatPage from "../VideoChatPage/VideoChatPage";
import BlockPage from "../BlockPage/BlockPage";

export const HomeContext = createContext();
const Home = (props) => {
  const { socketState } = useContext(SocketContainerContext);
  const { data, setChange } = useContext(AppContext);
  const [inComingCall, setInComingCall] = useState(false);
  const [senderInfo, setSenderInfo] = useState();
  const [callId, setCallId] = useState();
  const [idConversation, setIdConversation]= useState()
  const navigate= useNavigate()
  useEffect(()=> {
    socketState?.on("navigate_chat_from_notification_desktop_to_client", (data)=> {
      if(localStorage.getItem("appdesktop")== "true") {
        navigate("/chat/"+ data?.roomId)
      }
    })
  }, [socketState])
  useEffect(() => {
    socketState?.emit("join_room_self", { meId: localStorage.getItem("uid") });
  }, [socketState]);
  useEffect(() => {
    if (data?._id) {
      socketState?.emit("joinUser", { user: data });
    }
  }, [socketState, data]);
  useEffect(() => {
    socketState?.on("signal_to_user", (dataSocket) => {
      if (dataSocket?.user_to_call === data?._id) {
        socketState.emit("receiver_to_call", { call_id: dataSocket.call_id, idConversation: dataSocket?.idConversation });
        setInComingCall(() => true);
        setIdConversation(()=> dataSocket?.idConversation)
        setCallId(() => dataSocket.call_id);
        setSenderInfo(dataSocket.senderInfo);
      }
    });
  }, [socketState, data?._id]);
  useEffect(() => {
    socketState?.on("update_profile_user_on", (data) => {
      setChange((prev) => !prev);
    });
     // eslint-disable-next-line
  }, [socketState]);

  if(data?.is_block=== false) {
    return (
      <HomeContext.Provider value={{ setInComingCall, inComingCall }}>
        <Routes>
          <Route
            path={"/*"}
            element={
              <div className={"ajdkasjkdjfaesas"} style={{ width: "100%" }}>
                <div
                  className={"djasjkfjkejamwlawas"}
                  style={{ width: "100%", display: "flex", alignItems: "center" }}
                >
                  <Profile />
                  <MainScreen />
                </div>
                {inComingCall === true && (
                  <InComingCall
                    {...senderInfo}
                    setInComingCall={setInComingCall}
                    call_id={callId}
                    idConversation={idConversation}
                  />
                )}
              </div>
            }
          />
          {/* <Route path={"/call/:idConversation"} element={<VideoChatPage />} /> */}
        </Routes>
      </HomeContext.Provider>
    );
  }
  else if(data?.is_block=== true) {
    return <BlockPage firstname={data?.username} />
  }
};

export default Home;

import { memo, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SocketContainerContext } from "../../../SocketContainer/SocketContainer";
import TypingEffect from "../../TypingEffect/TypingEffect";
import ChooseFile from "./ChooseFile";
import SendButton from "./SendButton";
import { AppContext } from "../../../App";
// import TypingText from "./TypingText";

const BottomSection = memo((props) => {
    const {idConversation }= useParams()
    const [typing, setTyping] = useState(false);
    const [userTyping, setUserTyping] = useState();
    const { socketState } = useContext(SocketContainerContext);
    const {data }= useContext(AppContext)
    const [unSeenMessage, setUnSeenMessage]= useState(()=> 0)
    useEffect(() => {
      socketState.on("broadcast_to_all_user_in_room_typing", (data) => {
        if(data?.data?.roomId === idConversation) {
          setTyping(data.data.typing);
          setUserTyping(data.data.data.username);
        }
        else {
          setTyping(false)
        }
      });
      return ()=> setTyping(false)
    }, [socketState, idConversation]);
    const sendNewMessage= ()=> {
      setUnSeenMessage(prev=> parseInt(prev) + 1)
      console.log(data)
      socketState.emit("send_new_message", {roomId: idConversation, idConversation, unSeenMessage: parseInt(unSeenMessage) + 1, data, senderId: localStorage.getItem("uid"), message: props?.contentText})
    }
    const newestMessage= ()=> {
      socketState.emit("update_newest_message", {roomId: idConversation, lastUpdate: new Date().toLocaleString("en-US", { timeZone: 'Asia/Ho_Chi_Minh' }), idConversation, unSeenMessage: parseInt(unSeenMessage) + 1, data, senderId: localStorage.getItem("uid"), message: props?.contentText})
    }
    
    return (
      <div
        className={"fjdkjgjdksdjdksa"}
        style={{
          width: "100%",
          height: 68,
          padding: 16,
          borderTop: "1px solid #d7d7d7",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <ChooseFile {...props} />
        {/* <TypingText {...props} /> */}
        <SendButton newestMessage={newestMessage} sendNewMessage={sendNewMessage} {...props} />
        {typing === true && <TypingEffect userTyping={userTyping} />}
      </div>
    );
  });

  export default BottomSection
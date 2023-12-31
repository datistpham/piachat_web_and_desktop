import axios from "axios"
import Cookies from "js-cookie"
import { SERVER_URL } from "../../config/config"

const update_last_conversation_id = async (idConversation) => {
    const res= await axios({
        url: SERVER_URL+ "/api/users/update/last/conversation/"+ localStorage.getItem("uid"),
        data: {
            idConversation
        },
        method: "post",
        headers: {
            "authorization": "Bearer "+ localStorage.getItem("accessToken")
        }
    })
    const result= await res.data
    return result
}

export default update_last_conversation_id
import axios from "axios"
import Cookies from "js-cookie"
import { SERVER_URL } from "../../config/config"

const get_last_conversation_id = async (setData) => {
    const res= await axios({
        url: SERVER_URL+ "/api/users/get/last/conversation/"+ localStorage.getItem("uid"),
        method: "get",
        headers: {
            "authorization": "Bearer "+ localStorage.getItem("accessToken")
        }
    })
    const result= await res.data
    return setData(result)
}

export default get_last_conversation_id
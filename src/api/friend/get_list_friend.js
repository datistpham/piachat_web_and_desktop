import axios from "axios"
import Cookies from "js-cookie"
import { SERVER_URL } from "../../config/config"

const get_list_friends= async (id, setData)=> {
    const res= await axios({
        url: `${SERVER_URL}/api/users/get-list-user-send-request-add-friend-of-me/${localStorage.getItem("uid")}`,
        method: "get",
        headers: {
            "authorization": "Bearer "+ localStorage.getItem("accessToken")
        }
    })
    const result= await res.data
    return setData(result)
}

export default get_list_friends
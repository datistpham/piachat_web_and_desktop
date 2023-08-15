import axios from "axios"
import Cookies from "js-cookie"
import { SERVER_URL } from "../../config/config"

const unfriend= async (friendId, setData)=> {
    const res= await axios({
        url: SERVER_URL+ "/api/users/unfriend/"+ friendId,
        method: "post",
        data: {
            userId: localStorage.getItem("uid")
        },
        headers: {
            "authorization": "Bearer "+ localStorage.getItem("accessToken")
        }
    })
    const result= await res.data
    return setData(result)
}

export default unfriend
import axios from "axios"
import Cookies from "js-cookie"
import { SERVER_URL } from "../../config/config"

const deaf_user= async (deaf)=> {
    const res= await axios({
        url: SERVER_URL+ "/api/users/deaf",
        method: "post",
        headers: {
            "authorization": "Bearer "+ localStorage.getItem("accessToken")
        },
        data: {
            deaf,
            id_user: localStorage.getItem("uid")
        }
    })
    const result= await res.data
    return result
}

export default deaf_user
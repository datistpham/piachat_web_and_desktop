import axios from "axios"
import Cookies from "js-cookie"
import { SERVER_URL } from "../../config/config"

const out_group= async (id_conversation, setData)=> {
    const res= await axios({
        url: SERVER_URL+ "/api/conversations/out-group/"+ id_conversation,
        method: "post",
        headers: {
            "authorization": "Bearer "+ localStorage.getItem("accessToken")
        },
        data: {
            userId: localStorage.getItem("uid")
        }
    })
    const result= await res.data
    console.log(result)
    window.location.href= window.location.origin
    return setData(prev=> !prev)

}

export default out_group
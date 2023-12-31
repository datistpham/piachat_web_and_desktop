import axios from "axios"
import Cookies from "js-cookie"
import { SERVER_URL } from "../../config/config"

const get_list_user_request_make_friend_to_me = async (setData) => {
  const res= await axios({
    url: SERVER_URL+ "/api/users/get/user/request-make-friend/to/me/"+ localStorage.getItem("uid"),
    method: "get",
    headers: {
        "authorization": "Bearer "+ localStorage.getItem("accessToken")
    }
  })
  const result= await res.data
  return setData(result)
}

export default get_list_user_request_make_friend_to_me
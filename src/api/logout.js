import Cookies from "js-cookie"

const logout= ()=> {
    Cookies.remove("uid")
    Cookies.remove("accessToken")
    localStorage.removeItem("uid")
    localStorage.removeItem("accessToken")
    window.location.reload()
}

export default logout
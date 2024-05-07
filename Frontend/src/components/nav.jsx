import {Link} from "react-router-dom"
export  function getCookie(name) {
    let cookieArray = document.cookie.split('; ')
    let cookie = cookieArray.find((row) => row.startsWith(name + '='))
    return cookie ? cookie.split('=')[1] :""
}
function Nav() {
    function delcookies() {
        var allCookies = document.cookie.split(';');
        for (var i = 0; i < allCookies.length; i++) 
            document.cookie = allCookies[i] + "=;expires=" 
            + new Date(0).toUTCString();
        location.reload()
        
    }
    return (
        <div className={window.outerWidth>=600?`flex justify-evenly w-96 h-16 items-center absolute  text-xl bg-white bg-opacity-10 border-4 border-white text-white rounded-3xl p-41`:
        `flex justify-evenly w-11/12 mt-5 h-16 items-center absolute  text-xl bg-white bg-opacity-10 border-4 border-white text-white rounded-3xl p-41`}>
        <div><Link to="/">Home</Link></div>
        <div><Link to="/">About</Link></div>
        <div className={!getCookie("token") && "hidden"}>
        <div><Link to="/video">Video</Link></div>
        </div>

        <div className={getCookie("token") ? " hidden" : "w-24 flex"}>
            <div>
            <Link to={"/sign"}><button className=" p-2 m-1 hover:bg-green-600 hover:bg-opacity-5">Sign</button></Link>
            </div>
            <div>
            <Link to={"/login"}><button className=" border-l-2 border-white m-1 hover:bg-green-600 hover:bg-opacity-5 p-2 ">Login</button></Link>
            </div>
        </div>
        <div className={!getCookie("token") && "hidden"}>
            <button onClick={delcookies}>Logout</button>
        </div>
    </div>
    )
}
export default Nav;
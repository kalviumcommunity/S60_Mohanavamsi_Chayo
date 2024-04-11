import {Link} from "react-router-dom"
function Nav() {

    return (
        <div className=" flex justify-evenly w-96 h-16 items-center absolute  text-xl bg-white bg-opacity-10 border-4 border-white text-white rounded-3xl p-4">
        {/* <img/> */}
        <div><Link to="/">Home</Link></div>
        <div><Link to="/">About</Link></div>

        <div className={"w-24 flex"}>

            <div>
            <Link to={"/sign"}><button className=" p-2 m-1 hover:bg-green-600 hover:bg-opacity-5 rounded-xl">Sign</button></Link>
            </div>
            <div>
            <Link to={"/login"}><button className=" border-l-2 border-white m-1 hover:bg-green-600 hover:bg-opacity-5 p-2 rounded-xl ">Login</button></Link>
            </div>
        </div>
    </div>
    )
}
export default Nav;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Nav, { getCookie } from "./nav";
import axios from "axios";

function Home() {
  const [room, setRoom] = useState("");
  const [password, setPassword] = useState("");
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const socket = io("https://s60-mohanavamsi-chayo-2ovy.onrender.com");
  const nav = useNavigate();

  useEffect(() => {
    // Fetch users
    axios
      .get("https://s60-mohanavamsi-chayo-2ovy.onrender.com/users", {
        headers: { authorization: getCookie("token") },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

    // Fetch rooms
    axios
      .get("https://s60-mohanavamsi-chayo-2ovy.onrender.com/rooms", {
        headers: { authorization: getCookie("token") },
      })
      .then((res) => {
        console.log(res.data);
        setRooms(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handlePayment = async () => {
    try {
      const orderResponse = await axios.post(
        "http://localhost:8000/createOrder",
      );

      const { amount, id: order_id, currency } = orderResponse.data;

      const options = {
        key: "rzp_test_EzUsahd1tsDo2l", 
        amount: amount.toString(),
        currency: currency,
        name: "Chayo",
        description: "Test Transaction",
        order_id: order_id,
        handler: async function (response) {
            console.log(response)
            alert("Payment Successful!");
        },
        prefill: {
          name: getCookie("username") || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed. Please try again.");
    }
  };


  function routeCreator() {
    if (rooms.some((i) => i.roomid === room)) {
      alert(
        "Hey, this room already exists. If you're a member in this room, please join."
      );
    } else {
      if (room.trim() !== "" && getCookie("username")) {
        socket.emit("route", room, getCookie("username"), password);
        nav(`/chat/${room}`);
      } else {
        alert("Please enter the room ID. If not logged in, please login.");
      }
    }
  }

  function handleChange(e) {
    const { value } = e.target;
    setRoom(value);
  }

  function join() {
    if (room.trim() !== "" && getCookie("username")) {
      axios
        .get(
          `https://s60-mohanavamsi-chayo-2ovy.onrender.com/data/${room}`,
          { headers: { authorization: getCookie("token") } }
        )
        .then((res) => {
          if (res.data[0].password === password) {
            nav(`/chat/${room}`);
          } else {
            alert("Wrong password");
          }
        });
    } else {
      alert("Please enter the room ID. If not logged in, please login.");
    }
  }

  function handleUserClick(name) {
    if (name === getCookie("username")) {
      alert("You can't chat with yourself!");
    } else if (getCookie("username")) {
      nav(`/single/${name}&${getCookie("username")}`, {
        state: { status: "single" },
      });
    }
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(window.innerWidth, window.outerWidth);

  return (
    <div
      className={
        window.outerWidth >= 600
          ? `bg-gray-950 selection:bg-white selection:text-black h-screen text-white flex justify-center items-center`
          : `flex-col justify-around text-white bg-gray-950 w-screen`
      }
    >
      <div
        className={
          window.outerWidth >= 600
            ? `flex justify-center absolute top-4`
            : `flex mb-52 justify-center`
        }
      >
        <Nav />
        
      </div>

      <div className="flex flex-col justify-center items-center">
        <h1 className="text-5xl">Chayo</h1>
        <input
          placeholder="Create or join a room!"
          className="mt-6 p-2 h-10 rounded-xl focus:bg-black focus:text-white text-black"
          name="route"
          value={room}
          onChange={handleChange}
        />
        <input
          placeholder="Password"
          className="m-6 p-2 h-10 rounded-xl focus:bg-black focus:text-white text-black"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <div className="flex justify-evenly">
          <button
            className="w-32 p-2 mr-1 rounded-3xl border border-white hover:bg-white hover:text-black text-white"
            onClick={routeCreator}
          >
            Create!
          </button>
          <button
            className="w-32 p-2 rounded-3xl border border-white hover:bg-white hover:text-black text-white"
            onClick={join}
          >
            Join
          </button>
        </div>
        <button
          className={window.outerWidth >= 600?"mt-8 absolute z-10 right-10 top-0 w-40 p-2 rounded-3xl border border-green-500 bg-white hover:bg-black hover:text-white text-black":"hidden"}
          onClick={handlePayment}
        >
          Buy me a Coffe ☕
        </button>
      </div>
      <div
        className={
          window.outerWidth >= 600
            ? `overflow-y-scroll absolute left-2 flex flex-col h-screen`
            : `overflow-y-scroll flex flex-col h-screen`
        }
      >
        <h1 className="text-5xl mt-8 text-center">Users</h1>
        <input
          type="text"
          placeholder="Search users..."
          className="m-6 p-2 h-10 rounded-xl focus:bg-black focus:text-white text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-col items-center mt-4 p-3">
          {filteredUsers.map((user, index) => (
            <div
              key={index}
              className="flex items-center w-80 border border-white shadow-md shadow-white p-2 mt-4 cursor-pointer transition duration-300 ease-in-out hover:bg-white hover:text-black rounded-xl"
              onClick={() => handleUserClick(user.name)}
            >
              <img
                src={user.photo}
                alt={user.name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div className="flex flex-col">
                <h1 className="text-3xl">{user.name}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

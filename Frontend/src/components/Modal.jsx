import { useState, useEffect } from 'react';

// Function to get cookie by name
function getCookie(name) {
  let cookieArray = document.cookie.split('; ');
  console.log('Cookies:', cookieArray); 
  let cookie = cookieArray.find((row) => row.startsWith(name + '='));
  console.log('Retrieved cookie:', cookie); 
  return cookie ? cookie.split('=')[1] : "";
}

// Modal component
const Modal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  function delcookies() {
    var allCookies = document.cookie.split(';');
    for (var i = 0; i < allCookies.length; i++) 
        document.cookie = allCookies[i] + "=;expires=" 
        + new Date(0).toUTCString();
    location.reload()
    
}

  useEffect(() => {
    if (isOpen) {
      const userCookie = getCookie("username");
      const emailCookie = getCookie("email");

      console.log('Username Cookie:', userCookie);
      console.log('Email Cookie:', emailCookie);

      if (userCookie) {
        setUsername(userCookie);
      } else {
        setUsername("");
      }
      if (emailCookie) {
        setEmail(emailCookie);
      } else {
        setEmail("");
      }
    }
  }, [isOpen]);
  

  if (!isOpen) return null;

  return (
    <div className="main-modal">
      <center>
        <p className='modal-text'>Name: {username || 'Please login'}</p>
        <button onClick={delcookies} className='logout-btn'>Logout</button>
      </center>
      <br />
    </div>
  );
};

// Main component
const AccountDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsModalOpen(true);
  };

  const handleMouseLeave = () => {
    setIsModalOpen(false);
  };
  const imageUrl = getCookie("photo")

  return (
    <div 
      className="lol" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={imageUrl}
        alt="Profile"
        className='profilephoto'
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AccountDetails;
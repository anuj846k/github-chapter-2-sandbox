import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addUser, removeUser } from "../utils/userSlice";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => { // Sign-out successful.
      })
      .catch((error) => { 
        navigate("/error");
      });
  };

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
          })
        );
        navigate("/browse")
        // User is signed in.
      } else {
        // User is signed out
        dispatch(removeUser());
        navigate("/");
      }
    });
  }, []);



  return (
    <div className="absolute w-full px-8 py-2 bg-gradient-to-b from-black z-10 flex justify-between">
      <img className="w-80 py-2" src="./download.png" alt="Logo" />
      {user && (
        <div className="flex items-center">
          <img className="w-14 h-14 mr-3 rounded-full" src={user?.photoURL} alt="" />
          <button
            onClick={handleSignOut}
            className="bg-orange-500 font-bold text-white p-2 rounded-md"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;

import {
  Avatar,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import blankProfilePicture from "../../assets/blank-profile-picture.png";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { useEffect } from "react";
import { fetchUserInfo, selectUserProfile } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentUser } from "../../store/authSlice";
import { showContactList } from "../../store/uiSlice";
import { useNavigate } from "react-router-dom";

export default function ChatListHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const userProfile = useSelector(selectUserProfile);
  const avatarUrl = userProfile?.avatar || blankProfilePicture;

  useEffect(() => {
    if (currentUser && !userProfile) {
      // Fetch user profile if not already fetched
      dispatch(fetchUserInfo(currentUser.id));
    }
  }, [currentUser, userProfile, dispatch]);

  // to handle show contactsList
  const handleAllContactsPage = () => {
    dispatch(showContactList());
  };

  // to handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Navigate to the login page after logging out
  };

  return (
    <div className="bg-white h-16 px-4 py-3 flex justify-between items-center">
      {console.log("userProfile :", userProfile)}
      <div className="cursor-pointer">
        <Avatar src={avatarUrl} alt="Profile pic" size="sm" />
      </div>
      <div className="flex gap-6">
        <IconButton
          variant="text"
          title="New chat"
          onClick={handleAllContactsPage}
        >
          <BsFillChatLeftTextFill className="text-xl text-[#2563EB]" />
        </IconButton>
        <Menu
          animate={{
            mount: { y: 0 },
            unmount: { y: 25 },
          }}
        >
          <MenuHandler>
            <IconButton variant="text" title="Menu">
              <BsThreeDotsVertical className="text-xl text-[#2563EB]" />
            </IconButton>
          </MenuHandler>
          <MenuList>
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
}

ChatListHeader.propTypes = {};

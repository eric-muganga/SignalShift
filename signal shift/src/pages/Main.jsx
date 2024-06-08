import ChatWindow from "../components/chat/ChatWindow";
import ChatsList from "../components/layouts/ChatsList";
import { useSelector } from "react-redux";
import { selectCurrentChatUser } from "../store/chatSlice";
import Empty from "../components/chat/Empty";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { fetchUserInfo, selectUserProfile } from "../store/userSlice";
import { useLoaderData } from "react-router-dom";
import { selectMessageSearch } from "../store/uiSlice";
import SearchMessages from "../components/chat/SearchMessages";

function Main() {
  //const authLoading = useSelector(selectAuthLoading);
  const currentUser = useLoaderData();
  const currentChatUser = useSelector(selectCurrentChatUser);
  const userProfile = useSelector(selectUserProfile);
  const messageSearch = useSelector(selectMessageSearch);

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  console.log("currentUser: ", currentUser);
  console.log("userProfile: ", userProfile);
  return (
    <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
      <ChatsList />
      {currentChatUser ? (
        <div className={messageSearch ? "grid grid-cols-2" : "grid-cols-2"}>
          <ChatWindow />

          {messageSearch && <SearchMessages />}
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
}

export default Main;

export const userLoader = async (store) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await store.dispatch(fetchUserInfo(user.uid));
          resolve(user);
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(null);
      }
    });

    // Clean up subscription on loader unmount
    return () => unsubscribe();
  });
};

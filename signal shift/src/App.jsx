import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import Main, { userLoader } from "./pages/Main";
import { Provider } from "react-redux";
import store from "./store/store";
//import { generateRandomUsers } from "./utils/addRandomContacts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <LoginForm />,
      },
      {
        path: "signUp",
        element: <SignupForm />,
      },
      {
        path: "main",
        element: <Main />,
        loader: () => userLoader(store),
      },
    ],
  },
]);

function App() {
  //generateRandomUsers(10);
  //const dispatch = useDispatch();
  return (
    <Provider store={store}>
      <RouterProvider router={router} />;
    </Provider>
  );
}

export default App;

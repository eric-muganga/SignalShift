import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";

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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

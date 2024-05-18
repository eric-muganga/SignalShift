import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import Main from "./pages/Main";
import { AuthProvider } from "./contexts/AuthContext";
import Onboarding from "./pages/Onboarding";
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
        path: "/onboarding/:userId",
        element: <Onboarding />,
      },
      {
        path: "main",
        element: <Main />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;

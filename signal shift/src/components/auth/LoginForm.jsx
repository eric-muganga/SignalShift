import { useState } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Checkbox,
  Input,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../common/Button";
import { useAuth } from "../../contexts/AuthContext";

function LoginForm() {
  // initial state for the from
  const initialValues = {
    email: "",
    password: "",
  };

  const [userDetails, setUserDetails] = useState(initialValues);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // handling input change
  function handleChange(event) {
    const { name, value } = event.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  }

  // handleSignup function onSubmit
  async function handleSignup(event) {
    event.preventDefault();

    setError("");

    try {
      await login(userDetails.email, userDetails.password);
    } catch (error) {
      setError(error.message || "Failed to log in");
      navigate("/main");
    }

    setUserDetails(initialValues);
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-72 mt-auto">
        <CardHeader
          variant="gradient"
          className=" mt-4 mb-2 grid h-12 place-items-center"
        >
          <Typography variant="h5" className="text-center">
            Sign In
          </Typography>

          {error && (
            <Typography variant="small" color="red" className="mb-4">
              {error}
            </Typography>
          )}
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardBody className="flex flex-col gap-2">
            <Input
              type="email"
              color="indigo"
              name="email"
              label="Email"
              placeholder="name@mail.com"
              value={userDetails.email}
              required
              onChange={handleChange}
            />
            <Input
              type="password"
              color="indigo"
              name="password"
              label="Password"
              value={userDetails.password}
              onChange={handleChange}
              required
            />
            <div className="-ml-2.5">
              <Checkbox color="indigo" label="Remember Me" />
            </div>
            <Button type="submit">Sign In</Button>
            <Typography variant="small" className="mt-3 flex justify-center">
              Don&apos;t have an account?
              {/* to add a link to the LoginForm once the user has an account */}
              <Link to="signUp" className="ml-1 font-bold">
                {" "}
                Sign up
              </Link>
            </Typography>
          </CardBody>
        </form>
      </Card>
    </div>
  );
}

export default LoginForm;

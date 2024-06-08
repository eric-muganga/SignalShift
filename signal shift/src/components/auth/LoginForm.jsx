import { useState } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Checkbox,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../common/Input";
import Button from "../common/Button";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";

function LoginForm() {
  // initial state for the from
  const initialValues = {
    email: "",
    password: "",
  };

  const [userDetails, setUserDetails] = useState(initialValues);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // handling input change
  function handleChange(event) {
    const { name, value } = event.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  }

  // handleSignup function onSubmit
  async function handleLogin(event) {
    event.preventDefault();

    setError("");

    try {
      const resultAction = await dispatch(
        login({ email: userDetails.email, password: userDetails.password })
      );

      if (login.fulfilled.match(resultAction)) {
        navigate("/main");
      } else {
        throw new Error(resultAction.payload || "Failed to log in");
      }
    } catch (error) {
      setError(error.message || "Failed to log in");
    }
    setUserDetails(initialValues);
  }

  return (
    <div className="flex justify-center items-center">
      <Card className="w-72 m-24">
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
        <form onSubmit={handleLogin}>
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

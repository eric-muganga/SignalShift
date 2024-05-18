import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Input,
} from "@material-tailwind/react";

import Button from "../common/Button";
import { useAuth } from "../../contexts/AuthContext";

function SignupForm() {
  // initial state for the from
  const initialValues = {
    email: "",
    password: "",
  };

  const [userDetails, setUserDetails] = useState(initialValues);
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState("");

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
      await signup(userDetails.email, userDetails.password);
      navigate("/main");
      setUserDetails(initialValues);
    } catch (error) {
      setError(error.message || "Failed to create an account");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-80 mt-auto">
        <CardHeader
          variant="gradient"
          className="mt-4 mb-2 grid h-12 place-items-center"
        >
          <Typography variant="h5" className="text-center">
            Create an account
          </Typography>

          {error && (
            <Typography variant="small" color="red" className="mb-4">
              {error}
            </Typography>
          )}
        </CardHeader>

        <form onSubmit={handleSignup}>
          <CardBody className="flex flex-col gap-4">
            <Input
              type="email"
              color="indigo"
              name="email"
              label="Email"
              placeholder="name@mail.com"
              value={userDetails.email}
              onChange={handleChange}
              required
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
            <Button type="submit">Create account</Button>
            <Typography variant="small" className="mt-3 flex justify-center">
              Already have an account?
              {/* to add a link to the LoginForm once the user has an account */}
              <Link to="/" className="ml-1 font-bold">
                Sign In
              </Link>
            </Typography>
          </CardBody>
        </form>
      </Card>
    </div>
  );
}

export default SignupForm;

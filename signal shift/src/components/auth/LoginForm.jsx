import PropTypes from "prop-types";
import { useState } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Checkbox,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

import Input from "../common/Input";
import Button from "../common/Button";

function LoginForm() {
  // initial state for the from
  const initialValues = {
    email: "",
    password: "",
  };

  const [userDetails, setUserDetails] = useState(initialValues);

  // handling input change
  function handleChange(event) {
    const { name, value } = event.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  }

  // handleSignup function onSubmit
  function handleSignup(event) {
    event.preventDefault();

    // to Dispatch the signIn action using Redux

    setUserDetails(initialValues);
  }

  return (
    <Card className="w-72 mt-auto">
      <CardHeader
        variant="gradient"
        className=" mt-4 mb-2 grid h-12 place-items-center"
      >
        <Typography variant="h5" className="text-center">
          Sign In
        </Typography>
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
            onChange={handleChange}
          />
          <Input
            type="password"
            color="indigo"
            name="password"
            label="Password"
            value={userDetails.password}
            onChange={handleChange}
          />
          <div className="-ml-2.5">
            <Checkbox color="indigo" label="Remember Me" />
          </div>
          <Button color="indigo" type="submit" className="mt-3">
            Sign In
          </Button>
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
  );
}

LoginForm.propTypes = {};

export default LoginForm;

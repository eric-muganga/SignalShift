import PropTypes from "prop-types";
import { useState } from "react";

import { Link } from "react-router-dom";

import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";

import Input from "../common/Input";
import Button from "../common/Button";

function SignupForm() {
  // initial state for the from
  const initialValues = {
    email: "",
    password: "",
    displayName: "",
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

    // to Dispatch the signup action using Redux

    setUserDetails(initialValues);
  }

  return (
    <Card className="w-80 mt-auto">
      <CardHeader
        variant="gradient"
        className="mt-4 mb-2 grid h-12 place-items-center"
      >
        <Typography variant="h5" className="text-center">
          Create an account
        </Typography>
      </CardHeader>

      <form onSubmit={handleSignup}>
        <CardBody className="flex flex-col gap-4">
          <Input
            type="text"
            color="indigo"
            name="displayName"
            label="Display Name"
            value={userDetails.displayName}
            onChange={handleChange}
            required
          />
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
  );
}

SignupForm.propTypes = {};

export default SignupForm;

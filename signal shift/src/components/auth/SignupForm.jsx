import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { signup } from "../../store/authSlice";
import Button from "../common/Button";
import { doc, setDoc } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import { useDispatch } from "react-redux";

function SignupForm() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // initial state for the from
  const initialValues = {
    email: "",
    password: "",
    displayName: "",
  };
  const [userDetails, setUserDetails] = useState(initialValues);
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
      const resultAction = await dispatch(
        signup({ email: userDetails.email, password: userDetails.password })
      );

      if (signup.fulfilled.match(resultAction)) {
        const userCredential = resultAction.payload;
        //console.log(userCredential);

        await setDoc(doc(database, "users", userCredential.id), {
          email: userDetails.email,
          id: userCredential.id,
          blocked: [],
          sentMessages: [],
          receivedMessages: [],
        });

        const userId = userCredential.id;
        navigate(`/onboarding/${userId}`);
        setUserDetails(initialValues);
      } else {
        throw new Error(resultAction.payload || "Failed to create an account");
      }
    } catch (error) {
      setError(error.message || "Failed to create an account");
      console.log(error.message);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-80 m-24">
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
    </div>
  );
}

SignupForm.propTypes = {};

export default SignupForm;

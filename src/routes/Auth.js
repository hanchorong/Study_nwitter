import { authService } from "fBase";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "@firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    console.log(name, value);

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
      } else {
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);

  const onSocialClick = async (event) => {
    const { target: name } = event;

    console.log(event.target.name);
    let provider;
    if (name === "google") {
      // provider = new GoogleAuthProvider();
    } else if (name === "github") {
      // provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);
    console.log(data);
  };

  return (
    <>
      <div>
        <form onSubmit={onSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={onChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={onChange}
            autoComplete="false"
          />
          <input
            type="submit"
            value={newAccount ? "Create Account" : "Sign in"}
          />
          <span>{error}</span>
        </form>
        <span onClick={toggleAccount}>
          {newAccount ? "Sign In" : "Create Account"}
        </span>
        <div>
          <button name="google" onClick={onSocialClick}>
            Continue with Google
          </button>
          <button name="github" onClick={onSocialClick}>
            Continue with Github
          </button>
        </div>
      </div>
    </>
  );
};

export default Auth;

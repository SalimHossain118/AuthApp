/** @format */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import Oauth from "../components/Oauth";

const Signin = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeHandeler = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // end =>

  const submitHandeler = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());

      const res = await fetch("/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));

      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={submitHandeler} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="email"
          id="email"
          className="bg-slate-200 p-3 rounded-lg"
          onChange={changeHandeler}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="bg-slate-200 p-3 rounded-lg"
          onChange={changeHandeler}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Sign In"}
        </button>
        <Oauth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont Have An Account ?</p>
        <Link to="/signup">
          <span className="text-blue-500">SignUp</span>
        </Link>
      </div>
      <p className="text-red-500 mt-5">
        {error ? error.message || "Something went worng" : ""}
      </p>
    </div>
  );
};

export default Signin;

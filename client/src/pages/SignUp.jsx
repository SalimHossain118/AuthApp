/** @format */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeHandeler = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // end =>

  const submitHandeler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      navigate("/signin");
    } catch (error) {
      setLoading(false);

      setError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">SignUp</h1>
      <form onSubmit={submitHandeler} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          id="username"
          className="bg-slate-200 p-3 rounded-lg"
          onChange={changeHandeler}
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          className="bg-slate-200 p-3 rounded-lg"
          onChange={changeHandeler}
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className="bg-slate-200 p-3 rounded-lg"
          onChange={changeHandeler}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Signup"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have An Account ?</p>
        <Link to="/signin">
          <span className="text-blue-500">Sign in</span>
        </Link>
      </div>
      <p className="text-red-500 mt-5">{error && "Something went worng"}</p>
    </div>
  );
};

export default SignUp;

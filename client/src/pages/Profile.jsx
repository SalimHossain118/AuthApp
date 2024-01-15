/** @format */

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from "../redux/user/userSlice"; //

import { useDispatch } from "react-redux";

const Profile = () => {
  const [imageUp, setImageUp] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  const fileReferrance = useRef(null);
  const { currentUser } = useSelector((state) => state.user);

  const submitHandeler = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/v1/users/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  }; // end =>

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }; // end =>
  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/v1/users/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  }; // end =>
  const handleSignOut = async () => {
    try {
      await fetch("/api/v1/auth/signout");
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  }; // end =>

  const handleFileUpload = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageUp.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageUp);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  useEffect(() => {
    if (imageUp) {
      handleFileUpload(imageUp);
    }
  }, [imageUp]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={submitHandeler} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileReferrance}
          hidden
          accept="image/*"
          onChange={(event) => setImageUp(event.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt=""
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
          onClick={() => fileReferrance.current.click()}
        />
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="text-green-600 mt-2 mb-2">{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          defaultValue={currentUser.username}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteAccount}
          className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      {/* end=> */}
      {/* <p className="text-red-700 mt-5">{error && "Something went wrong!"}</p> */}
      <p className="text-green-700 mt-5">
        {" "}
        {updateSuccess && "User is updated successfully!"}
      </p>
    </div>
  );
};

export default Profile;

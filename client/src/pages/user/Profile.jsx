import React, { useEffect, useState, useRef } from "react";
import { MdEmail } from "react-icons/md";
import { FaUser, FaEdit } from "react-icons/fa";
import {
  useChangePasswordMutation,
  useChangeProfileImgMutation,
  useUpdateProfileMutation,
  useViewProfileQuery,
} from "../../redux/api/userApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosLock } from "react-icons/io";
import { MdRemoveRedEye } from "react-icons/md";
import { FaEyeSlash } from "react-icons/fa";

const Profile = () => {
  const fileInputRef = useRef(null);
  const nameInputRef = useRef(null); // Ref for the name input
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [updateProfileDetailToggle, setUpdateProfileDetailToggle] =
    useState(false);

  const [changePasswordToggle, setChangePasswordToggle] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const {
    data: profileInfo,
    isLoading: profileInfoLoading,
    isError: profileInfoError,
    refetch: profileInfoRefetch,
  } = useViewProfileQuery();
  const [
    changeProfileImg,
    { isLoading: changeProfileImgLoading, isError: changeProfileImgError },
  ] = useChangeProfileImgMutation();

  const [
    updateProfileDetails,
    { isLoading: updatedProfileLoading, isError: updatedProfileError },
  ] = useUpdateProfileMutation();

  const [
    changePassword,
    { isLoading: changePasswordLoading, isError: changePasswordError },
  ] = useChangePasswordMutation();

  useEffect(() => {
    if (profileInfo) {
      const { user } = profileInfo;
      setName(user.name);
      setEmail(user.email);
      setProfileImg(user.avatar.url);
      setSubscriptionId(user.subscription?.id);
      setSubscriptionStatus(user.subscription?.status);
      setPlaylist(user.playlist);
    }
  }, [profileInfo]);

  useEffect(() => {
    if (updateProfileDetailToggle && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [updateProfileDetailToggle]);

  const handleAvatar = () => {
    fileInputRef.current.click();
  };

  // change avatar
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await changeProfileImg(formData).unwrap();
        toast.success(res.message);
        profileInfoRefetch();
      } catch (error) {
        toast.error("Error uploading file. Please try again.");
        console.error("Error uploading file:", error.message);
      }
    }
  };

  // update profile details
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const updatedProfile = { name, email };

    try {
      const res = await updateProfileDetails(updatedProfile).unwrap();
      toast.success(res.message);
      setUpdateProfileDetailToggle(false); // Switch back to view mode
      profileInfoRefetch();
    } catch (error) {
      toast.error("Error updating profile. Please try again.");
      console.error("Error updating profile:", error.message);
    }
  };

  // change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validations
    if (!oldPassword) {
      return toast.error("Old password is required.");
    }
    if (!newPassword) {
      return toast.error("New password is required.");
    }
    if (!confirmNewPassword) {
      return toast.error("Confirm new password is required.");
    }
    if (newPassword !== confirmNewPassword) {
      return toast.error("New password and confirmation do not match.");
    }

    const passwordData = { oldPassword, newPassword };

    try {
      const res = await changePassword(passwordData).unwrap();
      toast.success(res.message || "Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setChangePasswordToggle(false);
    } catch (error) {
      toast.error(
        error.message || "An error occurred while changing the password."
      );
      console.error("Error changing password:", error);
    }
  };

  return (
    <div className="mt-[64px] min-h-[calc(100vh-64px)] w-screen bg-box4 ">
      <div className="container mx-auto px-2 bg-primery mt-3 lg:rounded-xl p-3 flex flex-col lg:flex-row gap-3 text-background">
        <div className="w-full lg:w-1/3 lg:h-[80vh] flex flex-col items-center gap-3">
          <h1 className="text-4xl uppercase font-bold overflow-hidden">
            Profile
          </h1>
          {/* profile image */}
          <div className="mt-3 relative">
            <div className="w-36 h-36 rounded-full overflow-hidden relative">
              {avatar ? (
                <img
                  src={URL.createObjectURL(avatar)}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={profileImg === "temp" ? "/dp.jpg" : profileImg}
                  alt="DP"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="text-background absolute bottom-0 right-3">
              <FaEdit
                className="text-3xl cursor-pointer"
                onClick={handleAvatar}
              />
              <input
                type="file"
                name="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
              />
            </div>
          </div>

          {changePasswordToggle ? (
            // change password
            <div className="w-full">
              <form onSubmit={handleChangePassword} className="w-full">
                <label htmlFor="password" className="flex flex-col">
                  <span className="font-semibold">Old Password</span>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Old Password"
                      className="rounded pl-6 pr-3 py-1 focus:outline-none text-box1 w-full border-2 border-background "
                      minLength={5}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <div className="text-background text-xl absolute top-2 left-1">
                      <IoIosLock />
                    </div>
                    <div
                      className="text-background absolute top-1 right-1 text-2xl cursor-pointer"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? <FaEyeSlash /> : <MdRemoveRedEye />}
                    </div>
                  </div>
                </label>
                <label htmlFor="password" className="flex flex-col">
                  <span className="font-semibold">New Password</span>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      className="rounded pl-6 pr-3 py-1 focus:outline-none text-box1 w-full border-2 border-background "
                      minLength={5}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div className="text-background text-xl absolute top-2 left-1">
                      <IoIosLock />
                    </div>
                    <div
                      className="text-background absolute top-1 right-1 text-2xl cursor-pointer"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <MdRemoveRedEye />}
                    </div>
                  </div>
                </label>
                <label htmlFor="confirmPassword" className="flex flex-col">
                  <span className="font-semibold">Confirm New Password</span>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="New Confirm Password"
                      className="rounded pl-6 pr-3 py-1 focus:outline-none text-box1 w-full border-2 border-background "
                      minLength={5}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <div className="text-background text-xl absolute top-2 left-1">
                      <IoIosLock />
                    </div>
                  </div>
                </label>
                <button
                  className="w-full text-center bg-secondary rounded-lg font-semibold mt-3 py-1 uppercase"
                  type="submit"
                >
                  Save Changes
                </button>
                <button
                  className="w-full text-center bg-[#FF0000] rounded-lg font-semibold mt-2 py-1 uppercase"
                  onClick={() => setChangePasswordToggle(false)}
                >
                  cancel
                </button>
              </form>
            </div>
          ) : updateProfileDetailToggle ? (
            // view / edit - email , name
            <div className="w-full">
              <form onSubmit={handleProfileUpdate} className="w-full">
                <label htmlFor="name" className="flex flex-col">
                  <span className="font-semibold">Name</span>
                  <div className="relative">
                    <input
                      type="text"
                      className="rounded pl-6 pr-3 py-1 focus:outline-none text-box1 w-full border-2 border-background "
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      ref={nameInputRef}
                    />
                    <div className="text-background absolute top-2 left-1">
                      <FaUser className="text-xl" />
                    </div>
                  </div>
                </label>
                <label htmlFor="email" className="flex flex-col">
                  <span className="font-semibold">Email</span>
                  <div className="relative">
                    <input
                      type="email"
                      className="rounded pl-6 pr-3 py-1 focus:outline-none text-box1 w-full border-2 border-background "
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="text-background absolute top-2 left-1">
                      <MdEmail className="text-xl" />
                    </div>
                  </div>
                </label>
                <button
                  className="w-full text-center bg-secondary rounded-lg font-semibold mt-3 py-1 uppercase"
                  type="submit"
                >
                  Save Changes
                </button>
                <button
                  className="w-full text-center bg-[#FF0000] rounded-lg font-semibold mt-2 py-1 uppercase"
                  onClick={() => setUpdateProfileDetailToggle(false)}
                >
                  cancel
                </button>
              </form>
            </div>
          ) : (
            <div className="w-full">
              <label htmlFor="name" className="flex flex-col">
                <span className="font-semibold">Name</span>
                <div className="relative">
                  <input
                    type="text"
                    className="rounded pl-6 pr-3 py-1 focus:outline-none text-box1 w-full border-2 border-background bg-transparent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    readOnly
                  />
                  <div className="text-background absolute top-2 left-1">
                    <FaUser className="text-xl" />
                  </div>
                </div>
              </label>
              <label htmlFor="email" className="flex flex-col">
                <span className="font-semibold">Email</span>
                <div className="relative">
                  <input
                    type="email"
                    className="rounded pl-6 pr-3 py-1 focus:outline-none text-box1 w-full border-2 border-background bg-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly
                  />
                  <div className="text-background absolute top-2 left-1">
                    <MdEmail className="text-xl" />
                  </div>
                </div>
              </label>
              <button
                className="w-full text-center bg-secondary rounded-lg font-semibold mt-3 py-1 uppercase"
                onClick={() => setUpdateProfileDetailToggle(true)}
              >
                Edit Profile
              </button>
              <button
                onClick={() => setChangePasswordToggle(true)}
                className="w-full text-center bg-secondary rounded-lg font-semibold py-1 uppercase mt-2"
              >
                change password
              </button>
              <button className="w-full text-center bg-secondary rounded-lg font-semibold py-1 uppercase mt-2">
                manage Subscription
              </button>
            </div>
          )}

          {/* buttons */}
        </div>
        {/* playlist */}
        <div className="w-full lg:w-2/3 h-56 bg-secondary overflow-x-auto">
          {playlist?.length > 0 &&
            playlist.map((item, i) => (
              <Link
                key={i}
                to={`/courseInfo/${item.course}`}
                className="container max-w-sm"
              >
                <img
                  src={item.poster}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;

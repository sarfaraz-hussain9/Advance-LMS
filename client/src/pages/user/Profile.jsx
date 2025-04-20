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

import dpDefault from "../../assets/Images/dp.jpg";

const Profile = () => {
  const fileInputRef = useRef(null);
  const nameInputRef = useRef(null); // Ref for the name input
  const [email, setEmail] = useState("");
  const [admin, setAdmin] = useState(false);
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
      if (user.role === "admin") {
        setAdmin(true);
      }
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
    <div className="my-2 min-h-[calc(100vh-64px)] w-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col lg:flex-row gap-6">
          {/* Left Section - Profile Details */}
          <div className="w-full lg:w-1/3 flex flex-col items-center gap-6">
            <h1 className="text-3xl font-bold text-[#007BFF]">Profile</h1>

            {/* Profile Image */}
            <div className="relative">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#007BFF]">
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
              <div className="absolute bottom-0 right-0 bg-[#007BFF] p-2 rounded-full cursor-pointer hover:bg-[#0056b3] transition-colors">
                <FaEdit className="text-white text-xl" onClick={handleAvatar} />
                <input
                  type="file"
                  name="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>

            {/* Profile Actions */}
            {changePasswordToggle ? (
              // Change Password Form
              <form
                onSubmit={handleChangePassword}
                className="w-full space-y-4"
              >
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Old Password"
                    className="w-full px-4 py-2 pl-10 border border-[#6c757d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <IoIosLock className="absolute left-3 top-3 text-[#6c757d]" />
                  <div
                    className="absolute right-3 top-3 text-[#6c757d] cursor-pointer"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <FaEyeSlash /> : <MdRemoveRedEye />}
                  </div>
                </div>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    className="w-full px-4 py-2 pl-10 border border-[#6c757d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <IoIosLock className="absolute left-3 top-3 text-[#6c757d]" />
                  <div
                    className="absolute right-3 top-3 text-[#6c757d] cursor-pointer"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <MdRemoveRedEye />}
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full px-4 py-2 pl-10 border border-[#6c757d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                  <IoIosLock className="absolute left-3 top-3 text-[#6c757d]" />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#007BFF] text-white py-2 rounded-lg font-semibold hover:bg-[#0056b3] transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setChangePasswordToggle(false)}
                  className="w-full bg-[#FF0000] text-white py-2 rounded-lg font-semibold hover:bg-[#cc0000] transition-colors"
                >
                  Cancel
                </button>
              </form>
            ) : updateProfileDetailToggle ? (
              // Edit Profile Form
              <form onSubmit={handleProfileUpdate} className="w-full space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-2 pl-10 border border-[#6c757d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    ref={nameInputRef}
                  />
                  <FaUser className="absolute left-3 top-3 text-[#6c757d]" />
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 pl-10 border border-[#6c757d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <MdEmail className="absolute left-3 top-3 text-[#6c757d]" />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#007BFF] text-white py-2 rounded-lg font-semibold hover:bg-[#0056b3] transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setUpdateProfileDetailToggle(false)}
                  className="w-full bg-[#FF0000] text-white py-2 rounded-lg font-semibold hover:bg-[#cc0000] transition-colors"
                >
                  Cancel
                </button>
              </form>
            ) : (
              // View Profile Details
              <div className="w-full space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-2 pl-10 border border-[#6c757d] rounded-lg focus:outline-none bg-transparent"
                    value={name}
                    readOnly
                  />
                  <FaUser className="absolute left-3 top-3 text-[#6c757d]" />
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 pl-10 border border-[#6c757d] rounded-lg focus:outline-none bg-transparent"
                    value={email}
                    readOnly
                  />
                  <MdEmail className="absolute left-3 top-3 text-[#6c757d]" />
                </div>
                <button
                  onClick={() => setUpdateProfileDetailToggle(true)}
                  className="w-full bg-[#007BFF] text-white py-2 rounded-lg font-semibold hover:bg-[#0056b3] transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setChangePasswordToggle(true)}
                  className="w-full bg-[#007BFF] text-white py-2 rounded-lg font-semibold hover:bg-[#0056b3] transition-colors"
                >
                  Change Password
                </button>
                {admin ? (
                  <Link
                    to="/admin"
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center block"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <button className="w-full bg-[#007BFF] text-white py-2 rounded-lg font-semibold hover:bg-[#0056b3] transition-colors">
                    Manage Subscription
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Section - Playlist */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl font-bold text-[#007BFF] mb-4">
              MY COURSES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {playlist?.length > 0 &&
                playlist.map((item, i) => (
                  <Link
                    key={i}
                    to={`/courseInfo/${item.course}`}
                    className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={item.poster}
                      alt="Course Poster"
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 bg-white">
                      <p className="text-lg font-semibold text-[#343a40]">
                        {item.title}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

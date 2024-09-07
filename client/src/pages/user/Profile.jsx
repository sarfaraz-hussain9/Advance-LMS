import React, { useEffect, useState, useRef } from "react";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useViewProfileQuery } from "../../redux/api/userApi";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const Profile = () => {
  const fileInputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [playlist, setPlaylist] = useState([]);

  // chandle avatar
  const [avatar, setAvatar] = useState(null);

  const {
    data: profileInfo,
    isLoading: profileInfoLoading,
    isError: profileInfoError,
    refetch: profileInfoRefetch,
  } = useViewProfileQuery();

  useEffect(() => {
    profileInfoRefetch();
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

  const handleAvatar = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="mt-[64px] min-h-[calc(100vh-64px)] w-screen bg-box4 ">
      <div className="container text-text mx-auto px-2 bg-primery mt-3 md:rounded-xl p-3 flex flex-col lg:flex-row gap-3">
        <div className="w-full lg:w-1/3 lg:h-[80vh] flex flex-col items-center gap-3">
          <h1 className="text-4xl uppercase font-bold overflow-hidden">
            Profile
          </h1>
          {/* profile image */}
          <div className=" mt-3 relative">
            <div className=" w-36 h-36 rounded-full overflow-hidden relative">
              {avatar ? (
                <img
                  src={URL.createObjectURL(avatar)} // Create a URL for the selected file
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={`${profileImg === "temp" ? "/dp.jpg" : profileImg}`}
                  alt="DP"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="text-background absolute bottom-0 right-3">
              <FaEdit className=" text-3xl" onClick={handleAvatar} />
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </div>
          </div>
          {/* details */}
          <div className="w-full">
            <label htmlFor="name" className="flex flex-col">
              <span className="font-semibold">Name</span>
              <div className="relative">
                <input
                  type="text"
                  className="rounded pl-6 pr-2 py-1 focus:outline-none text-background w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  readOnly
                />
                <div className="text-accent absolute top-2 left-1">
                  <FaUser />
                </div>
              </div>
            </label>
            <label htmlFor="email" className="flex flex-col">
              <span className="font-semibold">Email</span>
              <div className="relative">
                <input
                  type="email"
                  className="rounded pl-6 pr-2 py-1 focus:outline-none text-background w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly
                />
                <div className="text-accent absolute top-2 left-1">
                  <MdEmail />
                </div>
              </div>
            </label>
          </div>

          {/* buttons */}

          <Link
            to={``}
            className="w-full text-center bg-secondary rounded-lg font-semibold"
          >
            <p>UPDATE PROFILE</p>
          </Link>
          <Link
            to={``}
            className="w-full text-center bg-secondary rounded-lg font-semibold"
          >
            <p>CHANGE PASSWORD</p>
          </Link>
        </div>
        {/* playlist */}
        <div className="w-full lg:w-2/3 h-56 bg-secondary">
          {playlist?.length > 0 &&
            playlist.map((item, i) => (
              <Link
                key={i}
                to={`/courseInfo/${item.course}`}
                className="container max-w-sm "
              >
                <img src={item.poster} alt="" />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;

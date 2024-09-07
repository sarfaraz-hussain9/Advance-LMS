import React, { useEffect, useId } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Landing = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, []);
  return (
    <div className="mt-[64px] min-h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] w-screen bg-background overflow-hidden absolute">
      {/* side things */}

      <div className="hidden lg:block w-1/3 h-1/3 rotate-45 overflow-clip bg-secondary absolute bottom-36 -left-[20rem] blur-3xl "></div>
      <div className="hidden lg:block w-1/3 h-1/3 rotate-45 overflow-clip bg-secondary absolute top-20 -right-[20rem] blur-3xl "></div>

      {/* main content */}
      <div className="container min-w-sm mx-auto h-auto lg:h-full flex flex-col-reverse lg:flex-row px-4 lg:px-8 py-6 lg:py-8  ">
        <div className="text-text lg:w-1/2 h-full flex flex-col justify-center gap-4 mt-4 lg:mt-0 z-10">
          <div className="">
            <h1 className="text-5xl md:text-7xl  font-semibold overflow-hidden text-accent uppercase">
              Learn,
            </h1>
            <h1 className="text-6xl md:text-8xl  font-semibold overflow-hidden text-accent uppercase">
              Grow,
            </h1>
            <h1 className="text-6xl md:text-8xl  font-bold overflow-hidden text-accent uppercase">
              Succeed.
            </h1>
          </div>

          <p className="text-lg lg:text-xl font-semibold tracking-wide ">
            At ED MACHINE, we make learning accessible with courses to help you
            master new skills and achieve your goals.
          </p>

          <Link
            to={"/signin"}
            className="bg-primery text-background py-2 px-4 lg:py-3 lg:px-6 font-bold rounded text-lg lg:text-xl lg:max-w-sm text-center"
          >
            JOIN US
          </Link>
        </div>
        <div className="w-full lg:w-1/2 ">
          <img
            src="/bgmob.png"
            alt=""
            className=" w-full h-full object-cover lg:object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Landing;

import React from "react";

const Card = () => {
  return (
    <div className="container max-w-sm h-80 bg-box5 rounded-lg overflow-hidden p-2">
      <div className="relative flex flex-col justify-between h-full">
        <div>
          <img src="/1.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="">
          <div>
            <h1 className="text-2xl text-accent font-semibold">Dsa course</h1>
            <h1 className=" text-text font-semibold">&#8377; 100</h1>
          </div>

          <button className="bg-btn1 font-semibold px-3 py-1 mt-4 rounded">
            View Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;

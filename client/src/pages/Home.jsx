import React from "react";
import Card from "../components/Card";

const Home = () => {
  return (
    <div className="mt-[64px] min-h-[calc(100vh-64px)] w-screen py-4 bg-box4">
      <div className="container mx-auto px-2 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
};

export default Home;

import React from "react";
import Connection from "./Connection";

const SuggestedConnections = () => {
  return (
    <>
      <h1 className="text-2xl font-bold pl-14 my-8">
        Suggested Connections based on your career goals:
      </h1>
      <div className="flex flex-col gap-y-4 bg-white items-center">
        <Connection />
        <Connection />
        <Connection />
      </div>
    </>
  );
};

export default SuggestedConnections;

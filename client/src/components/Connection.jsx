import React from "react";
import connectionPhoto from "../assets/connection-photo.png";
import chatIcon from "../assets/chat_icon.png";
import linkIcon from "../assets/link_icon.png";

const Connection = () => {
  return (
    <div className="flex bg-white rounded-xl p-5 shadow-md items-center w-10/12">
      <div className="mr-4">
        <img src={connectionPhoto} alt="" />
      </div>
      <div>
        <div className="flex items-center gap-x-2">
          <h1 className="text-2xl font-semibold mb-1">John Doe</h1>
          <h2 className="text-gray-500">
            <i>1st</i>
          </h2>
          <p className="text-gray-500">•</p>
          <h2 className="text-gray-500">
            <i>Sophomore</i>
          </h2>
        </div>

        <p>
          I am a Bio major first year student; I want to know more about school.
          I am looking for a mentor in school resources & finding research
        </p>
      </div>
      <div className="flex flex-col gap-y-2">
        <button className="w-36 py-2 bg-gray-100 border border-gray-300 rounded-lg font-bold flex items-center justify-center gap-x-1">
          <img src={chatIcon} alt="Chat Icon" className="w-4 h-4" />
          Message
        </button>
        <button className="w-36 py-2 bg-brandGreen border border-gray-300 rounded-lg font-bold text-white flex items-center justify-center gap-x-1">
          <img src={linkIcon} alt="Link Icon" className="w-4 h-4" />
          Connect
        </button>
      </div>
    </div>
  );
};

export default Connection;

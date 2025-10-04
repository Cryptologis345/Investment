"use client";

import React, { useState } from "react";
import { FaGlobe } from "react-icons/fa";

const LanguageSelect: React.FC = () => {
  const [language, setLanguage] = useState("en");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    console.log("Language changed to:", e.target.value);
  };

  return (
    <div className="flex items-center gap-2 bg-[#0f143a] px-3 py-2 rounded-full">
      <FaGlobe className="text-white" />
      <select
        name="language"
        value={language}
        onChange={handleChange}
        className="bg-[#0f143a] text-white outline-none cursor-pointer"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
        <option value="de">Deutsch</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );
};

export default LanguageSelect;

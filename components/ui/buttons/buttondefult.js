"use client";

import React from "react";

const ButtonDefault = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  fullWidth = false,
  variant = "default", // 'default' or 'dark'
  ...props
}) => {
  const baseStyles = `
    px-12 py-4
    font-bold text-[15px] uppercase
    rounded-full 
    transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed
    [letter-spacing:0.12em]
  `;

  const variantStyles = {
    default: "bg-[#adff00] hover:bg-[#c6ff4f] text-[#1a1a1a]",
    dark: "bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.default}
        ${widthStyle}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonDefault;

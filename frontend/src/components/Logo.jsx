import React from 'react';

export default function Logo({ className = "", size = "default" }) {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  };

  return (
    <img
      src="/favicon-bg.png"
      alt="Logo"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}

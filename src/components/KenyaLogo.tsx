import React from "react";
import kenyaLogoImage from "../image/New-Kenya-logo.jpeg";

interface KenyaLogoProps {
  className?: string;
}

export default function KenyaLogo({ className = "w-8 h-8" }: KenyaLogoProps) {
  return (
    <img
      src={kenyaLogoImage}
      alt="Republic of Kenya logo"
      className={`${className} object-contain transition-transform duration-300 group-hover:scale-105 shrink-0 rounded-sm`}
    />
  );
}

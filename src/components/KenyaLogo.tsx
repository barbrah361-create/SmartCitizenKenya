import React from "react";

interface KenyaLogoProps {
  className?: string;
}

export default function KenyaLogo({ className = "w-8 h-8" }: KenyaLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 group-hover:scale-105 shrink-0`}
      aria-label="Republic of Kenya National Shield"
    >
      {/* Outer elegant golden crest ring */}
      <circle
        cx="50"
        cy="50"
        r="47"
        stroke="#D4AF37"
        strokeWidth="1.5"
        className="stroke-amber-500/80 dark:stroke-amber-400/80"
        fill="none"
      />

      {/* Traditional Crossed African Spears */}
      {/* Spear 1 (Diagonal Left to Right) */}
      <line
        x1="18"
        y1="18"
        x2="82"
        y2="82"
        stroke="#718096"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Spearhead Left */}
      <path
        d="M18 18 L24 28 L28 24 Z"
        fill="#4A5568"
        stroke="#718096"
        strokeWidth="1"
      />
      {/* Spear Tail Right */}
      <path
        d="M82 82 L76 72 L72 76 Z"
        fill="#4A5568"
        stroke="#718096"
        strokeWidth="1"
      />

      {/* Spear 2 (Diagonal Right to Left) */}
      <line
        x1="82"
        y1="18"
        x2="18"
        y2="82"
        stroke="#718096"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Spearhead Right */}
      <path
        d="M82 18 L76 28 L72 24 Z"
        fill="#4A5568"
        stroke="#718096"
        strokeWidth="1"
      />
      {/* Spear Tail Left */}
      <path
        d="M18 82 L24 72 L28 76 Z"
        fill="#4A5568"
        stroke="#718096"
        strokeWidth="1"
      />

      {/* The Traditional East African Masai Shield */}
      <g>
        {/* Shield Base Outline */}
        <path
          d="M50 12 C31 20 28 50 50 88 C72 50 69 20 50 12 Z"
          fill="#111827"
          stroke="#D4AF37"
          strokeWidth="2.5"
          strokeLinejoin="round"
          className="dark:fill-neutral-900"
        />

        {/* Flag of Kenya Stripes - Layered inside Shield */}
        {/* Top Black Stripe */}
        <path
          d="M50 12 C41 15 35 25 32.5 35 L67.5 35 C65 25 59 15 50 12 Z"
          fill="#000000"
        />
        
        {/* Middle Red Stripe (with White borders) */}
        <path
          d="M32.5 35 C31.5 41 31 49 31.5 58 L68.5 58 C69 49 68.5 41 67.5 35 Z"
          fill="#BB0000"
          stroke="#FFFFFF"
          strokeWidth="1.8"
        />
        
        {/* Bottom Green Stripe */}
        <path
          d="M31.5 58 C32.5 68 39 79 50 88 C61 79 67.5 68 68.5 58 Z"
          fill="#006600"
        />

        {/* Traditional White Crest Markings */}
        <path
          d="M50 13 L50 87"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeDasharray="2 3"
          className="opacity-75"
        />
        
        {/* Outer side white arcs */}
        <path
          d="M36 50 Q43 50 50 50 Q57 50 64 50"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinecap="round"
          className="opacity-50"
        />

        {/* Central Golden/White Rooster (Cockerel holding an axe - symbol of "Harambee") */}
        {/* Rooster Head & Body */}
        <circle cx="50" cy="46" r="3.5" fill="#FFFFFF" />
        <path d="M50 44 Q52 41 53 43 L50 46 Z" fill="#FFD700" /> {/* Beak */}
        <path d="M47 46 Q45 44 48 42" stroke="#FFFFFF" strokeWidth="1" /> {/* Tail Feathers */}
        <path d="M50 46 L47 52 L53 52 Z" fill="#FFFFFF" /> {/* Body */}
        
        {/* Miniature golden ceremonial axe representing development/progress */}
        <path
          d="M52 48 L58 48 M56 45 L58 45 L58 51 L56 51 Z"
          stroke="#FFD700"
          strokeWidth="1.2"
          fill="#FFD700"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

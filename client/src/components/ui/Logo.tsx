import React from 'react';
import logoSrc from '../../assets/Lotlite_Logo.png';

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export default function Logo({ className = "h-10 sm:h-12 w-auto", ...props }: LogoProps) {
  return (
    <img
      src={logoSrc}
      alt="Lotlite logo"
      className={`${className} select-none transition-all duration-300 object-contain`}
      {...props}
    />
  );
}
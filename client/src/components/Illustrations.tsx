import React from 'react';

export const CloudIllustration: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 46C12.4772 46 8 41.5228 8 36C8 30.8584 11.8797 26.6212 16.8789 26.0697C18.4239 19.1678 24.5828 14 32 14C40.0631 14 46.6853 20.0898 47.7956 28.0264C52.4287 29.0734 56 33.1524 56 38C56 43.5228 51.5228 48 46 48H18Z"
      fill="#E1F5FE"
      stroke="#B3E5FC"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <circle cx="24" cy="34" r="2" fill="#332C35" />
    <circle cx="38" cy="34" r="2" fill="#332C35" />
    <path d="M29 38C30.5 39.5 32.5 39.5 34 38" stroke="#FF80AB" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const StarIllustration: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32 6L39.1 21.4L56 23.4L43.5 34.9L46.9 51.6L32 43.2L17.1 51.6L20.5 34.9L8 23.4L24.9 21.4L32 6Z"
      fill="#FFF59D"
      stroke="#FFE082"
      strokeWidth="3"
      strokeLinejoin="round"
    />
  </svg>
);

export const HeartIllustration: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32 54C32 54 10 40 10 24C10 16 16.5 10 24.5 10C29 10 32 13 32 13C32 13 35 10 39.5 10C47.5 10 54 16 54 24C54 40 32 54 32 54Z"
      fill="#FFB6C1"
      stroke="#FF80AB"
      strokeWidth="3"
      strokeLinejoin="round"
    />
  </svg>
);

export const FlowerIllustration: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="18" r="8" fill="#F8C8DC" />
    <circle cx="46" cy="32" r="8" fill="#F8C8DC" />
    <circle cx="32" cy="46" r="8" fill="#F8C8DC" />
    <circle cx="18" cy="32" r="8" fill="#F8C8DC" />
    <circle cx="32" cy="32" r="9" fill="#FFE082" stroke="#FFD54F" strokeWidth="2" />
  </svg>
);

export const BookIllustration: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="10" width="40" height="46" rx="6" fill="#FFB7B2" stroke="#FF9AA2" strokeWidth="3" />
    <rect x="18" y="10" width="6" height="46" fill="#FF80AB" />
    <line x1="28" y1="22" x2="44" y2="22" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    <line x1="28" y1="30" x2="44" y2="30" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    <line x1="28" y1="38" x2="38" y2="38" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

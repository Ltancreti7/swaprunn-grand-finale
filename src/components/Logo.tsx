import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'homepage' | 'dashboard' | 'auth';
  showText?: boolean;
  showCar?: boolean;
  variant?: 'card' | 'plain';
}

const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'dashboard',
  showText = true,
  showCar = false,
  variant = 'card'
}) => {
  const sizeClasses = {
    homepage: { height: 'h-24 md:h-28 lg:h-40', width: 'w-auto' },
    dashboard: { height: 'h-10', width: 'w-auto' },
    auth: { height: 'h-20', width: 'w-auto' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <a href="/" className="group transition-all duration-300 hover:scale-105" aria-label="SwapRunn home">
        <img 
          src="/swaprunn-logo-2025.png?v=3" 
          alt="SwapRunn Logo" 
          className={`${currentSize.height} ${currentSize.width} drop-shadow-lg transition-all duration-300 group-hover:drop-shadow-xl`}
          style={{ transform: 'scale(1.5, 1.3)' }}
          loading="lazy"
        />
      </a>
    </div>
  );
};

export default Logo;
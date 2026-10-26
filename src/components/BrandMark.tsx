import React from 'react';
import { Link } from 'react-router-dom';

export const BrandMark: React.FC<{ className?: string; linkTo?: string }> = ({
  className = '',
  linkTo = '/',
}) => {
  const content = (
    <div className={`inline-flex items-center gap-2 select-none group ${className}`}>
      {/* Three marigold dots */}
      <span className="inline-flex items-center gap-1.5" aria-hidden="true">
        <span className="w-2.5 h-2.5 rounded-full bg-[#F2B134] transition-transform group-hover:scale-110" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#F2B134] transition-transform group-hover:scale-110 delay-75" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#F2B134] transition-transform group-hover:scale-110 delay-150" />
      </span>
      <span className="text-xs font-semibold tracking-wider uppercase text-[#13231F] dark:text-[#E6EEEA]">
        PEOPLE LIKE ME
      </span>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
};

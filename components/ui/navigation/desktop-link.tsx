import { usePageContext } from "vike-react/usePageContext";
import React, { ReactElement } from "react";

export default function DesktopLink({
    href,
    icon,
    label,
    isCompact = false,
  }: {
    href: string;
    icon?: ReactElement;
    label?: string;
    isCompact?: boolean;
  }) {
    const pageContext = usePageContext();
    const { urlPathname } = pageContext;
  
    const isActive =
      href === "/" ? urlPathname === href : urlPathname.startsWith(href);
  
    return (
      <a
        href={href}
        className={`
          text-xl flex group items-center transition-all ease-in border px-2 border-transparent duration-200 py-2  rounded-full w-full
          ${isCompact ? 'flex-col justify-center items-center w-full' : 'flex-row justify-start gap-3'}
          ${
            isActive
              ? 'px-4 text-white  bg-blue-500 shadow-glass' 
              : 'hover:px-3 bg-transparent text-gray-600 hover:bg-white/10 hover:border-white/5    hover:text-gray-900  focus:outline-none focus:ring-1 focus:ring-orange-400'
          }
          
        `}
        tabIndex={0}
        aria-label={label}
      >
        {icon &&
          React.cloneElement(icon, {
            className: `
              transition-all duration-300 w-[1rem] h-[1rem]
              ${icon.props.className || ""}
              ${isCompact ? 'group-hover:scale-[1.1]' : 'group-hover:scale-[1]'}
            `,
          })}
        {label && (
          <span className={`
            ${isCompact ? 'text-xs text-center w-full mt-1' : 'text-xs'}
          `}>
            {label}
          </span>
        )}
      </a>
    );
  }
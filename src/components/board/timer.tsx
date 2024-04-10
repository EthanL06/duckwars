import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// bg-gradient-to-r from-[#60F0FF] to-[#20D6E9]

const Timer = ({ count }: { count: number }) => {
  const [position, setPosition] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((pos) => pos + 1);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto flex h-4 w-full max-w-[400px] items-center justify-center overflow-clip rounded-full bg-[#E6FDFF] font-black text-white">
      <TimerImage
        className={cn(
          "absolute top-0 flex transition-all duration-500 ease-linear ",
        )}
        style={{
          right: `${position}rem`,
        }}
      />
      <div
        className="relative z-[9999]  font-mono"
        style={{
          WebkitTextStrokeWidth: "1px",
          WebkitTextStrokeColor: "black",
        }}
      >
        {count}
      </div>
    </div>
  );
};

const TimerImage = ({ className, style }: Props) => {
  const delays = useRef([1300, 1500, 1700, 1900, 3000]);
  return (
    <div className={className} style={style}>
      <div className="relative block h-full min-w-[20rem] bg-gradient-to-r from-[#60F0FF] to-[#20D6E9] text-transparent">
        .
      </div>
      <svg
        width="218"
        height="16"
        viewBox="0 0 218 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <mask
          id="mask0_0_1"
          style={{
            maskType: "alpha",
          }}
          maskUnits="userSpaceOnUse"
          x="-1"
          y="-5"
          width="219"
          height="29"
        >
          <path
            d="M206.5 3C211.5 -2.5 186.5 -2.66667 182.5 -2.5L-0.5 -4.5V23C69.8333 23.6667 196.2 21.6 199 20C202.5 18 213.5 22 217 16.5C220.001 11.7838 209.5 11.5 207 10.5C205.607 9.94291 201.077 8.96559 206.5 3Z"
            fill="#20D6E9"
          />
        </mask>
        <g mask="url(#mask0_0_1)">
          <path
            d="M206.5 3C211.5 -2.5 186.5 -2.66667 182.5 -2.5L-0.5 -4.5V23C69.8333 23.6667 196.2 21.6 199 20C202.5 18 213.5 22 217 16.5C220.001 11.7838 209.5 11.5 207 10.5C205.607 9.94291 201.077 8.96559 206.5 3Z"
            fill="url(#paint0_linear_0_1)"
          />
          <path
            d="M197.38 9.54454C201.876 13.0075 196.723 15.6365 193.585 16.5181C198.992 20.4293 209.268 21.1208 213.73 20.9777L230.313 0.796384C221.584 -3.32943 204.516 -9.93151 206.085 -3.3333C208.046 4.91447 191.758 5.21587 197.38 9.54454Z"
            fill="url(#paint1_linear_0_1)"
          />
        </g>
        <g
          className="bubble"
          style={{
            animationDuration: `${delays.current[0]}ms`,
          }}
          opacity="0.9"
        >
          <circle cx="211" cy="12" r="2" fill="#D6FBFF" />
          <path
            d="M211.146 10.6879C211.235 9.96509 209.071 11.0069 209.6 12.0224C209.851 12.5051 210.308 10.9663 211.146 10.6879Z"
            fill="white"
          />
        </g>
        <g
          className="bubble"
          style={{
            animationDuration: `${delays.current[1]}ms`,
          }}
        >
          <circle cx="198" cy="5" r="2" fill="#D6FBFF" />
          <path
            d="M198.146 3.68793C198.235 2.96509 196.071 4.00686 196.6 5.0224C196.851 5.50506 197.308 3.96631 198.146 3.68793Z"
            fill="white"
          />
        </g>
        <g
          className="bubble"
          style={{
            animationDuration: `${delays.current[2]}ms`,
          }}
          opacity="0.7"
        >
          <circle cx="165" cy="4" r="2" fill="#D6FBFF" />
          <path
            d="M165.146 2.68793C165.235 1.96509 163.071 3.00686 163.6 4.0224C163.851 4.50506 164.308 2.96631 165.146 2.68793Z"
            fill="white"
          />
        </g>
        <g
          className="bubble"
          style={{
            animationDuration: `${delays.current[3]}ms`,
          }}
          opacity="0.7"
        >
          <circle cx="178" cy="16" r="2" fill="#D6FBFF" />
          <path
            d="M178.146 14.6879C178.235 13.9651 176.071 15.0069 176.6 16.0224C176.851 16.5051 177.308 14.9663 178.146 14.6879Z"
            fill="white"
          />
        </g>
        <g
          className="bubble"
          style={{
            animationDuration: `${delays.current[4]}ms`,
          }}
          opacity="0.7"
        >
          <circle cx="183" cy="12" r="2" fill="#D6FBFF" />
          <path
            d="M183.146 10.6879C183.235 9.96509 181.071 11.0069 181.6 12.0224C181.851 12.5051 182.308 10.9663 183.146 10.6879Z"
            fill="white"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_0_1"
            x1="203"
            y1="2.50002"
            x2="154"
            y2="9"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#60F0FF" />
            <stop offset="1" stop-color="#20D6E9" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_0_1"
            x1="219"
            y1="15.5"
            x2="198"
            y2="6"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#8EF4FF" />
            <stop offset="1" stop-color="#ADF7FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Timer;

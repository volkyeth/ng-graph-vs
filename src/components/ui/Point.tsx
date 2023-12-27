import React from "react";

export interface PointProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}

export const Point: React.FC<PointProps> = ({ text, ...props }) => {
  return (
    <div
      className="border-1 rounded-md p-2 bg-gray-100 shadow-lg hover:bg-gray-200 text-black"
      {...props}
    >
      {text}
    </div>
  );
};

import type React from "react";
import "../css/progressbar.css";

type Progress = {
  curr: number;
  max: number;
};

const ProgressBar = ({curr, max}: Progress) => {
  const value = (curr/max) * 100;
  return (
    <div className="progress-bar-wrapper">
      <div 
      className="progress-bar"
      style={{ "--value": value } as React.CSSProperties}
      ></div>

      <h1 className="load-statment">
        {curr}/{max}
      </h1>
    </div>
  );
};

export default ProgressBar;

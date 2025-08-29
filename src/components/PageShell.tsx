import React from "react";

const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="app-shell">{children}</div>;
};

export default PageShell;

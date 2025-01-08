import React from "react";

type Props = {};

const Sidebar = (props: Props) => {
  return (
    <div className="fixed w-[6%] hover:w-[14%] top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-all shadow-lg bg-white"></div>
  );
};

export default Sidebar;

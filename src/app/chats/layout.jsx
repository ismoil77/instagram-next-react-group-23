import DefaultChat from "@/components/pages/chats/layout";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="flex w-full">
      <DefaultChat />
      {children}
    </div>
  );
};

export default layout;

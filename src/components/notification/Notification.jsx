"use client";
import React, { useState } from "react";
import { likeActive } from "@/assets/icon/layout/svg";
import { useTranslation } from "react-i18next";
import SimpleNotificationsDrawer from "./simple-notifications-drawer";

const Notification = ({ isMin = false }) => {
  const { t } = useTranslation();
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

  const NavLink = ({ label }) => (
    <div
      className="flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 cursor-pointer dark:text-white dark:hover:text-white dark:hover:bg-gray-800"
      onClick={() => setRightDrawerOpen(true)}
    >
      {likeActive}
      {!isMin && <p className="text-lg">{label}</p>}
    </div>
  );

  return (
    <div className="z-50">
      <NavLink label={t("layout.notification")} />
      <SimpleNotificationsDrawer
        open={rightDrawerOpen}
        onClose={() => setRightDrawerOpen(false)}
      />
    </div>
  );
};

export default Notification;

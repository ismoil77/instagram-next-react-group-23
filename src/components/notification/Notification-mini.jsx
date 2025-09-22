"use client";

import React, { useState } from "react";
import { like, likeActive } from "@/assets/icon/layout/svg";
import { useTranslation } from "react-i18next";
import SimpleNotificationsDrawer from "./simple-notifications-drawer";
import Styled from "@emotion/styled";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip"; // ✅ добавлено
import { usePathname } from "next/navigation";

const NotificationMini = ({ isMin = false }) => {
    const { t } = useTranslation();
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
    const pathname = usePathname(); // ✅ используем путь

    // ✅ Кастомизированный Tooltip
    const LightTooltip = Styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(() => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "white",
            color: "black",
            boxShadow: "0 0 5px 1px rgba(0,0,0, .0975)",
            fontSize: 11,
        },
        "& .MuiTooltip-arrow": {
            color: "white",
        },
    }));

    // ✅ Выбор иконки в зависимости от текущего пути
    const renderIcon = (path, activeIcon, inactiveIcon) => {
        return pathname === path ? inactiveIcon : activeIcon;
    };

    return (
        <div className="z-50">
            <LightTooltip title={t("layout.notification")} placement="right" arrow>
                <div
                    onClick={() => setRightDrawerOpen(true)}
                    className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center cursor-pointer"
                >
                    {renderIcon("/notification", likeActive, like)}
                </div>
            </LightTooltip>

            <SimpleNotificationsDrawer
                open={rightDrawerOpen}
                onClose={() => setRightDrawerOpen(false)}
            />
        </div>
    );
};

export default NotificationMini;

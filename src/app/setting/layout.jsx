"use client";
import React from "react";
import clsx from 'clsx';

import {
    PersonOutline,
    NotificationsNone,
    LockOutlined,
    StarOutline,
    Block,
    VisibilityOffOutlined,
    AccountCircle,
    ChatBubbleOutline,
    AlternateEmail,
    CommentOutlined,
    RepeatOutlined,
    DoNotDisturbOnOutlined,
    TextFields,
    VisibilityOff,
    VideoSettingsOutlined,
    FavoriteBorder,
    PaidOutlined,
    DownloadOutlined,
    AccessibilityNew,
    Translate,
    LaptopMac,
    HomeOutlined,
    BusinessCenterOutlined,
    VerifiedOutlined,
    HelpOutline,
    SecurityOutlined,
} from '@mui/icons-material';

import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const layout = ({ children }) => {
    const settingsMenu = [
        {
            section: 'Как вы используете Instagram',
            items: [
                { label: 'Редактировать профиль', href: '/setting/account', icon: <PersonOutline fontSize="small" /> },
                { label: 'Уведомления', href: '/setting/notifications', icon: <NotificationsNone fontSize="small" /> },
            ],
        },
        {
            section: 'Кто может видеть ваш контент',
            items: [
                { label: 'Конфиденциальность аккаунта', href: '/setting/privacy', icon: <LockOutlined fontSize="small" /> },
                { label: 'Близкие друзья', href: '/setting/close-friends', icon: <StarOutline fontSize="small" /> },
                { label: 'Заблокированные', href: '/setting/blocked', icon: <Block fontSize="small" /> },
                { label: 'Скрыть историю', href: '/setting/hide-story', icon: <VisibilityOffOutlined fontSize="small" /> },
            ],
        },
        {
            section: 'Взаимодействие с вами',
            items: [
                { label: 'Сообщения и ответы на истории', href: '/setting/messages-replies', icon: <ChatBubbleOutline fontSize="small" /> },
                { label: 'Метки и упоминания', href: '/setting/tags-mentions', icon: <AlternateEmail fontSize="small" /> },
                { label: 'Комментарии', href: '/setting/comments', icon: <CommentOutlined fontSize="small" /> },
                { label: 'Настройки репостов', href: '/setting/reposts', icon: <RepeatOutlined fontSize="small" /> },
                { label: 'Аккаунты с ограничениями', href: '/setting/restricted', icon: <DoNotDisturbOnOutlined fontSize="small" /> },
                { label: 'Скрытые слова', href: '/setting/hidden-words', icon: <TextFields fontSize="small" /> },
            ],
        },
        {
            section: 'Что вы видите',
            items: [
                { label: 'Скрытые аккаунты', href: '/setting/hidden-accounts', icon: <VisibilityOff fontSize="small" /> },
                { label: 'Настройки контента', href: '/setting/content-settings', icon: <VideoSettingsOutlined fontSize="small" /> },
                { label: 'Число отметок "Нравится" и репостов', href: '/setting/likes-reposts', icon: <FavoriteBorder fontSize="small" /> },
                { label: 'Платные подписки', href: '/setting/paid-subscriptions', icon: <PaidOutlined fontSize="small" /> },
            ],
        },
        {
            section: 'Ваше приложение и медиафайлы',
            items: [
                { label: 'Архивирование и скачивание', href: '/setting/download', icon: <DownloadOutlined fontSize="small" /> },
                { label: 'Специальные возможности', href: '/setting/accessibility', icon: <AccessibilityNew fontSize="small" /> },
                { label: 'Язык', href: '/setting/lang', icon: <Translate fontSize="small" /> },
                { label: 'Разрешения сайта', href: '/setting/site-permissions', icon: <LaptopMac fontSize="small" /> },
            ],
        },
        {
            section: 'Семейный центр',
            items: [
                { label: 'Родительский контроль для аккаунтов подростков', href: '/setting/parental-control', icon: <HomeOutlined fontSize="small" /> },
            ],
        },
        {
            section: 'Для профессиональных аккаунтов',
            items: [
                { label: 'Тип аккаунта и инструменты', href: '/setting/account-type', icon: <BusinessCenterOutlined fontSize="small" /> },
                { label: 'Покажите, что ваш профиль подтвержден', href: '/setting/verified', icon: <VerifiedOutlined fontSize="small" /> },
            ],
        },
        {
            section: 'Информация и поддержка',
            items: [
                { label: 'Помощь', href: '/setting/help', icon: <HelpOutline fontSize="small" /> },
                { label: 'Центр конфиденциальности', href: '/setting/privacy-center', icon: <SecurityOutlined fontSize="small" /> },
                { label: 'Статус аккаунта', href: '/setting/account-status', icon: <PersonOutline fontSize="small" /> },
            ],
        },
    ];

    const pathname = usePathname();

    return (
        <div className="flex w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <aside className="flex md:relative absolute z-[1] md:w-80 w-full md:h-auto h-[100vh] border-r border-gray-200 dark:border-gray-700 px-6 py-6 bg-white dark:bg-gray-800 flex-col overflow-y-auto">
                {/* Верхняя карточка Meta */}
                <Box
                    sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: '#e0e0e0',
                        mb: 4,
                        fontSize: 13,
                        lineHeight: 1.3,
                        color: '#444',
                        backgroundColor: '#fff',
                        '.dark &': {
                            borderColor: '#374151',
                            color: '#d1d5db',
                            backgroundColor: '#1f2937',
                        },
                    }}
                    className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-3 mb-4 text-sm"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <AccountCircle fontSize="small" color="primary" />
                        <Typography fontWeight={700} variant="body2">Meta</Typography>
                    </Box>

                    <Typography fontWeight={700} variant="body2" gutterBottom>
                        Центр аккаунтов
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
                        Управляйте кросс-сервисными функциями и настройками аккаунтов на платформах Meta.
                    </Typography>

                    <Box sx={{ color: 'text.secondary', fontSize: 13 }}>
                        <Box className="flex items-center gap-1 mb-0.5 cursor-default opacity-60 dark:text-gray-400">
                            <PersonOutline fontSize="small" />
                            <span>Личная информация</span>
                        </Box>
                        <Box className="flex items-center gap-1 mb-0.5 cursor-default opacity-60 dark:text-gray-400">
                            <LockOutlined fontSize="small" />
                            <span>Пароль и безопасность</span>
                        </Box>
                        <Box className="flex items-center gap-1 mb-2 cursor-default opacity-60 dark:text-gray-400">
                            <StarOutline fontSize="small" />
                            <span>Рекламные предпочтения</span>
                        </Box>
                        <Link href="#" className="text-blue-600 dark:text-blue-400 text-xs hover:underline">
                            Больше настроек в Центре аккаунтов
                        </Link>
                    </Box>
                </Box>

                {/* Меню настроек */}
                {settingsMenu.map(({ section, items }) => (
                    <Box key={section} sx={{ mb: 4 }}>
                        <Typography
                            variant="caption"
                            className="text-gray-600 dark:text-gray-400 font-semibold mb-1"
                        >
                            {section}
                        </Typography>
                        <nav className="flex flex-col gap-1">
                            {items.map(({ label, href, icon }) => {
                                const isActive = pathname === href;
                                return (
                                    <Link key={href} href={href} passHref>
                                        <div
                                            className={clsx(
                                                'flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer text-lg',
                                                isActive
                                                    ? 'bg-gray-200 font-semibold dark:bg-gray-700'
                                                    : 'hover:bg-gray-100 text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700'
                                            )}
                                        >
                                            {icon}
                                            {label}
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </Box>
                ))}
            </aside>
            <div className="flex-1 w-full overflow-y-auto bg-white dark:bg-gray-900">
                {children}
            </div>
        </div>
    );
};

export default layout;

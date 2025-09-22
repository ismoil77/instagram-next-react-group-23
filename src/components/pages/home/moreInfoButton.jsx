'use client';

import React, { useState, useEffect } from 'react';

const MoreMenuModal = ({ isOpen, onClose }) => {
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [animateMenu, setAnimateMenu] = useState(false);
  const [animateSuccess, setAnimateSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) setAnimateMenu(true);
    else setAnimateMenu(false);
  }, [isOpen]);

  const handleItemClick = (action) => {
    const messages = {
      'Пожаловаться': 'Жалоба принята',
      'Отменить подписку': 'Подписка отменена',
      'Добавить в избранное': 'Сохранено',
      'Перейти к публикации': 'Переход выполнен',
      'Поделиться...': 'Ссылка скопирована',
      'Копировать ссылку': 'Ссылка скопирована',
      'Вставить на сайт': 'Ссылка вставлена',
      'Об аккаунте': 'Информация открыта',
    };

    setMessage(messages[action]);
    setSuccessModalOpen(true);
    setAnimateSuccess(true);
  };

  const closeAll = () => {
    setAnimateSuccess(false);
    setTimeout(() => {
      setSuccessModalOpen(false);
      onClose();
    }, 200);
  };

  if (!isOpen && !successModalOpen) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div
            className={`bg-white dark:bg-gray-900 rounded-xl w-[400px] shadow-2xl transform transition-all duration-300 ${
              animateMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div className="p-1">
              {[
                'Пожаловаться',
                'Отменить подписку',
                'Добавить в избранное',
                'Перейти к публикации',
                'Поделиться...',
                'Копировать ссылку',
                'Вставить на сайт',
                'Об аккаунте',
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => handleItemClick(item)}
                  className={`w-full text-left px-4 py-3 ${
                    item.includes('Пожаловаться') || item.includes('Отменить')
                      ? 'text-red-500 font-semibold'
                      : 'text-gray-700 font-medium'
                  } text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
                >
                  {item}
                </button>
              ))}

              <button
                onClick={onClose}
                className="w-full text-left px-4 py-3 text-gray-700 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {successModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div
            className={`bg-white dark:bg-gray-900 rounded-xl max-w-sm w-full p-6 text-center shadow-2xl transform transition-all duration-300 ${
              animateSuccess ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8 text-green-500"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{message}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Операция успешно завершена.</p>
            <button
              onClick={closeAll}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MoreMenuModal;

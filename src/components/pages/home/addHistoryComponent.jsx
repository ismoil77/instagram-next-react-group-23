'use client'
import usePostStore from '@/store/pages/home/home'
import { useState, useEffect } from 'react'

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white font-medium transition-opacity duration-300 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      {message}
    </div>
  )
}

export default function AvatarUploader() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [toast, setToast] = useState(null)
  const [postId, setPostId] = useState(null)
  const { addStory } = usePostStore()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPostId(localStorage.getItem('postId') || 161)
    }
  }, [])

  const handleFileChange = e => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = ev => setPreview(ev.target.result)
      reader.readAsDataURL(selectedFile)
    }
  }

  const showToast = (message, type = 'success') => setToast({ message, type })

  const handleSubmit = async () => {
    if (!file || !postId) {
      showToast('Выберите файл и убедитесь, что PostId передан.', 'error')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('Image', file)
      await addStory(formData)

      showToast('История успешно загружена!')
      setFile(null)
      setPreview(null)
      document.getElementById('fileInput').value = ''
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Неизвестная ошибка загрузки'
      setUploadError(message)
      showToast(message, 'error')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <label htmlFor="fileInput" className="relative cursor-pointer">
        <div className="flex justify-center items-center text-[50px] border-2 h-[60px] w-[60px] rounded-full bg-white dark:bg-gray-800">
          +
        </div>
        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm">
          +
        </div>
      </label>

      <input
        type="file"
        id="fileInput"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 p-4 w-[300px] max-w-[90vw] flex flex-col items-center relative rounded-lg">
            <p className="text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">
              Ваша история
            </p>

            <div className="w-full h-[200px] mb-3 flex items-center justify-center">
              {file.type.startsWith('video/') ? (
                <video
                  src={preview}
                  controls
                  className="w-full h-full object-contain rounded-lg border border-gray-300 dark:border-gray-700"
                />
              ) : (
                <img
                  src={preview}
                  alt="Превью истории"
                  className="w-full h-full object-cover rounded-lg border border-gray-300 dark:border-gray-700"
                />
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className={`w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !isUploading
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isUploading ? 'Загрузка...' : 'Отправить'}
            </button>

            {uploadError && (
              <p className="text-red-500 text-xs mt-2 text-center">{uploadError}</p>
            )}

            <button
              onClick={() => {
                setFile(null)
                setPreview(null)
              }}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

import { useCallback, useState } from 'react'
import { Button, message } from 'antd'
import {
  InboxOutlined,
  UploadOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FileWordOutlined,
} from '@ant-design/icons'

import { uploadDocument } from '../../services/knowledge.service'
import { formatFileSize } from '../../utils/knowledge'

interface UploadCardProps {
  refreshData: () => Promise<void>
}

const UploadCard = ({ refreshData }: UploadCardProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const isPdf = selectedFile?.type === 'application/pdf'

  const validateFile = useCallback((file: File) => {
    const valid =
      file.type === 'application/pdf' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    if (!valid) {
      message.error('Chỉ hỗ trợ file PDF hoặc DOCX.')
      return false
    }

    if (file.size > 20 * 1024 * 1024) {
      message.error('Kích thước file không được vượt quá 20MB.')
      return false
    }

    return true
  }, [])

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (!file) {
        setSelectedFile(null)
        return
      }
      if (validateFile(file)) {
        setSelectedFile(file)
      }
    },
    [validateFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFileChange(file)
    },
    [handleFileChange]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFileChange(file)
      e.target.value = ''
    },
    [handleFileChange]
  )

  const handleUpload = async () => {
    if (!selectedFile) {
      message.warning('Vui lòng chọn tài liệu.')
      return
    }

    const token = localStorage.getItem('token') ?? ''

    try {
      setUploading(true)
      await uploadDocument(token, selectedFile)
      message.success('Upload tài liệu thành công.')
      setSelectedFile(null)
      await refreshData()
    } catch (error) {
      console.error(error)
      message.error('Upload thất bại.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-emerald-900 flex items-center gap-2">
          <UploadOutlined className="text-emerald-600" />
          Upload tài liệu
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Kéo thả hoặc chọn tài liệu PDF / DOCX để bổ sung tri thức cho chatbot.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed
          transition-all duration-200 ease-in-out
          flex flex-col items-center justify-center
          py-8 sm:py-10
          ${
            isDragOver
              ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
              : selectedFile
                ? 'border-emerald-300 bg-emerald-50/40'
                : 'border-gray-200 bg-gray-50/50 hover:border-emerald-300 hover:bg-emerald-50/30'
          }
        `}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf,.docx"
          onChange={handleInputChange}
          className="hidden"
        />

        {!selectedFile ? (
          <>
            <div
              className={`
                flex items-center justify-center w-14 h-14 rounded-2xl mb-3
                transition-colors duration-200
                ${isDragOver ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'}
              `}
            >
              <InboxOutlined className="text-2xl" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">Kéo & thả file vào đây</p>
            <p className="text-xs text-gray-400">hoặc nhấn để chọn tài liệu</p>
            <p className="text-xs text-gray-300 mt-2">Hỗ trợ PDF và DOCX · Tối đa 20MB</p>
          </>
        ) : (
          <div className="flex items-center gap-3 sm:gap-4 w-full max-w-md px-4">
            <div
              className={`
                flex items-center justify-center w-12 h-12 rounded-xl shrink-0
                ${isPdf ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}
              `}
            >
              {isPdf ? (
                <FilePdfOutlined className="text-xl" />
              ) : (
                <FileWordOutlined className="text-xl" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatFileSize(selectedFile.size)}
                <span className="mx-1.5">·</span>
                <span className={isPdf ? 'text-red-500' : 'text-blue-500'}>
                  {isPdf ? 'PDF' : 'DOCX'}
                </span>
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedFile(null)
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
            >
              <DeleteOutlined />
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
        <p className="text-xs text-gray-400">
          {selectedFile
            ? 'Nhấn "Upload" để tải tài liệu lên hệ thống'
            : 'Chọn file để bắt đầu upload'}
        </p>
        <div className="flex items-center gap-2">
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={!selectedFile || uploading}
            onClick={() => setSelectedFile(null)}
          >
            Xoá
          </Button>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            disabled={!selectedFile}
            loading={uploading}
            onClick={handleUpload}
            className="!bg-emerald-600 !border-emerald-600 hover:!bg-emerald-700"
          >
            Upload
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UploadCard

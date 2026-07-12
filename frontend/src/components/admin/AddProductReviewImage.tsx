interface AddProductReviewImageProps {
  imageFiles: File[]
  imagePreviewUrls: string[]
}

export default function AddProductReviewImage({
  imageFiles,
  imagePreviewUrls,
}: AddProductReviewImageProps) {
  return (
    <div className="uploadImage_review">
      <div className="image_preview w-full h-48 border border-gray-300 rounded-xl overflow-y-auto bg-gray-50 p-2">
        {imagePreviewUrls.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {imagePreviewUrls.map((previewUrl, index) => (
              <div
                key={`${previewUrl}-${index}`}
                className="relative h-40 overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <img
                  src={previewUrl}
                  alt={`Ảnh xem trước ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Chưa có hình ảnh xem trước
          </div>
        )}
      </div>
      {imageFiles.length > 0 && (
        <p className="mt-2 text-sm text-gray-500">Đã chọn {imageFiles.length} file ảnh</p>
      )}
    </div>
  )
}

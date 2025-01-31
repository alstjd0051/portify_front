"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onImageUpload(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">
          {isDragActive
            ? "이미지를 여기에 놓으세요"
            : "이미지를 드래그하거나 클릭하여 업로드하세요"}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          지원 형식: PNG, JPG, JPEG, GIF
        </p>
      </div>
    </div>
  );
};

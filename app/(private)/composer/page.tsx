"use client";

import React, { useState } from "react";
import { ComposerCanvas } from "@/components/features/composer/ComposerCanvas";
import { ImageUploader } from "@/components/features/composer/ImageUploader";

export default function ComposerPage() {
  const [overlayImage, setOverlayImage] = useState<string>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">이미지 컴포저</h1>

      <div className="flex flex-col gap-8">
        {/* 왼쪽: 이미지 업로더 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">이미지 업로드</h2>
          <ImageUploader onImageUpload={setOverlayImage} />

          {overlayImage && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">미리보기</h3>
              <img
                src={overlayImage}
                alt="업로드된 이미지"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
        </div>

        {/* 오른쪽: 카메라 뷰 */}
        <div className="aspect-video bg-gray-100 w-full h-fit rounded-lg overflow-hidden">
          <ComposerCanvas overlayImage={overlayImage} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">사용 방법</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>왼쪽 패널에서 이미지를 업로드하세요.</li>
          <li>카메라에 손바닥이 보이도록 손을 들어보세요.</li>
          <li>업로드한 이미지가 손바닥 위에 나타납니다.</li>
          <li>얼굴이 인식되면 초록색 박스로 표시됩니다.</li>
        </ul>
      </div>
    </div>
  );
}

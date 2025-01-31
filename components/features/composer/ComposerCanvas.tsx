"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

interface ComposerCanvasProps {
  overlayImage?: string;
}

export const ComposerCanvas: React.FC<ComposerCanvasProps> = ({
  overlayImage,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const modelRef = useRef<blazeface.BlazeFaceModel | null>(null);
  const requestRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  // 웹캠 설정
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  // 웹캠 초기화 완료 핸들러
  const handleWebcamReady = () => {
    console.log("웹캠 준비됨");
    setHasPermission(true);
  };

  // 웹캠 에러 핸들러
  const handleWebcamError = (error: string | DOMException) => {
    console.error("웹캠 에러:", error);
    setHasPermission(false);
    setIsLoading(false);
  };

  // 이미지 변경 시 처리
  useEffect(() => {
    if (!overlayImage) {
      imageRef.current = null;
      return;
    }

    const img = new Image();
    img.onload = () => {
      console.log("이미지 로드 성공:", {
        width: img.width,
        height: img.height,
      });
      imageRef.current = img;
    };
    img.onerror = (error) => {
      console.error("이미지 로드 실패:", error);
      imageRef.current = null;
    };
    img.src = overlayImage;
  }, [overlayImage]);

  // 프레임 처리 함수
  const processFrame = async () => {
    if (!webcamRef.current?.video || !modelRef.current || !canvasRef.current)
      return;

    try {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 캔버스 크기 설정
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 비디오 프레임 그리기
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 얼굴 감지
      const predictions = await modelRef.current.estimateFaces(video, false);

      setDebugInfo(`감지된 얼굴 수: ${predictions.length}`);

      // 얼굴 인식 결과 처리
      predictions.forEach((prediction: any) => {
        const start = prediction.topLeft as [number, number];
        const end = prediction.bottomRight as [number, number];
        const width = end[0] - start[0];
        const height = end[1] - start[1];
        const centerX = start[0] + width / 2;
        const centerY = start[1] + height / 2;

        // 디버깅용: 얼굴 영역 표시
        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 2;
        ctx.strokeRect(start[0], start[1], width, height);

        // 오버레이 이미지 표시
        if (imageRef.current) {
          try {
            const imgSize = Math.max(width, height) * 1.2;

            // 이미지 그리기
            ctx.drawImage(
              imageRef.current,
              centerX - imgSize / 2,
              centerY - imgSize / 2,
              imgSize,
              imgSize
            );

            // console.log("이미지 그리기 성공", {
            //   centerX,
            //   centerY,
            //   imgSize,
            //   faceWidth: width,
            //   faceHeight: height,
            // });
          } catch (error) {
            console.error("이미지 그리기 실패:", error);
          }
        }
      });
    } catch (error) {
      const err = error as Error;
      console.error("프레임 처리 중 오류:", err);
      setDebugInfo(`에러: ${err.message}`);
    }

    requestRef.current = requestAnimationFrame(processFrame);
  };

  // 모델 로드 및 설정
  useEffect(() => {
    let isActive = true;

    const setupModel = async () => {
      try {
        if (
          !hasPermission ||
          !webcamRef.current?.video ||
          isInitializedRef.current
        ) {
          return;
        }

        setIsLoading(true);
        setDebugInfo("모델 초기화 중...");

        // 이전 인스턴스 정리
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
          requestRef.current = null;
        }

        // TensorFlow.js 초기화
        await tf.ready();
        console.log("TensorFlow.js 준비됨");

        // BlazeFace 모델 로드
        console.log("BlazeFace 모델 로딩 시작");
        const model = await blazeface.load();
        console.log("BlazeFace 모델 로딩 완료");

        if (!isActive) return;

        modelRef.current = model;

        // 프레임 처리 시작
        requestRef.current = requestAnimationFrame(processFrame);
        isInitializedRef.current = true;
        setIsLoading(false);
        setDebugInfo("모델 초기화 완료");
        console.log("모델 초기화 완료");
      } catch (error) {
        const err = error as Error;
        console.error("모델 초기화 중 오류:", err);
        setIsLoading(false);
        setDebugInfo(`초기화 오류: ${err.message}`);
      }
    };

    setupModel();

    return () => {
      isActive = false;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [hasPermission]);

  return (
    <div className="relative w-full h-full">
      <Webcam
        ref={webcamRef}
        mirrored
        className="w-full h-full aspect-video"
        audio={false}
        videoConstraints={videoConstraints}
        onUserMedia={handleWebcamReady}
        onUserMediaError={handleWebcamError}
        screenshotFormat="image/jpeg"
      />
      {/* <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ transform: "scaleX(-1)" }}
      /> */}
      {!hasPermission && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
          <div className="text-center p-4 bg-white rounded-lg shadow-lg">
            <p className="text-gray-600 mb-4">카메라 권한이 필요합니다</p>
            <button
              onClick={() => {
                if (webcamRef.current) {
                  navigator.mediaDevices
                    .getUserMedia({ video: true })
                    .then(() => {
                      setHasPermission(true);
                    })
                    .catch((error) => {
                      console.error("카메라 권한 요청 실패:", error);
                    });
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              카메라 권한 허용
            </button>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">모델을 불러오는 중...</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
        {debugInfo}
      </div>
    </div>
  );
};

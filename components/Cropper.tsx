import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import { CheckIcon, CrossIcon } from './icons';

interface CropperProps {
  imageUrl: string;
  onConfirm: (blob: Blob | null) => void;
  onCancel: () => void;
}

export function Cropper({ imageUrl, onConfirm, onCancel }: CropperProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropperRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      if (canvas && ctx) {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
      }
    };
  }, [imageUrl]);

  const getCanvasRelativePos = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getCanvasRelativePos(e);
    setStartPos(pos);
    setCropRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;
    const pos = getCanvasRelativePos(e);
    const width = pos.x - startPos.x;
    const height = pos.y - startPos.y;
    setCropRect({
      x: width > 0 ? startPos.x : pos.x,
      y: height > 0 ? startPos.y : pos.y,
      w: Math.abs(width),
      h: Math.abs(height),
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };
  
  const handleConfirm = () => {
      if (cropRect.w > 0 && cropRect.h > 0) {
          const mainCanvas = canvasRef.current;
          if (!mainCanvas) return;

          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = cropRect.w;
          tempCanvas.height = cropRect.h;
          const tempCtx = tempCanvas.getContext('2d');

          if(tempCtx) {
              tempCtx.drawImage(
                  mainCanvas,
                  cropRect.x,
                  cropRect.y,
                  cropRect.w,
                  cropRect.h,
                  0,
                  0,
                  cropRect.w,
                  cropRect.h
              );
              tempCanvas.toBlob(onConfirm, 'image/jpeg', 0.95);
          }
      } else {
        onConfirm(null);
      }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 text-center">
        <p className="text-white text-2xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded-lg">
          Click and drag to select an area to translate
        </p>
      </div>

      <div 
        ref={cropperRef} 
        className="relative max-w-full max-h-[calc(100vh-150px)] overflow-auto cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} className="max-w-full max-h-full" />
        {cropRect.w > 0 && cropRect.h > 0 && (
          <div
            className="absolute border-4 border-dashed border-indigo-500 bg-indigo-500 bg-opacity-25 pointer-events-none"
            style={{
              left: cropRect.x,
              top: cropRect.y,
              width: cropRect.w,
              height: cropRect.h,
            }}
          />
        )}
      </div>

      <div className="absolute bottom-4 flex space-x-4">
        <button
          onClick={onCancel}
          className="flex items-center justify-center py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          <CrossIcon />
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={cropRect.w === 0 || cropRect.h === 0}
          className="flex items-center justify-center py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          <CheckIcon />
          Translate Selection
        </button>
      </div>
    </div>
  );
}

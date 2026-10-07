import React, { useRef, useState, useEffect } from 'react';
import { Palette, RotateCcw, Eraser, Trash2, Check, Sparkles } from 'lucide-react';
import { api } from '../services/api.js';

interface DrawingCanvasProps {
  onDrawingSaved: (url: string) => void;
  existingDrawingUrl?: string;
  onRemoveDrawing?: () => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  onDrawingSaved,
  existingDrawingUrl,
  onRemoveDrawing,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF80AB'); // Pink
  const [brushSize, setBrushSize] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [drawingPreviewUrl, setDrawingPreviewUrl] = useState<string | null>(existingDrawingUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const colors = [
    { name: 'Pink', hex: '#FF80AB' },
    { name: 'Lavender', hex: '#E1BEE7' },
    { name: 'Mint', hex: '#B5EAD7' },
    { name: 'Sunny Yellow', hex: '#FFE082' },
    { name: 'Peach', hex: '#FFDAC1' },
    { name: 'Soft Charcoal', hex: '#332C35' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill canvas background with white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), imageData]); // Keep last 15 states
  };

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = history.slice(0, -1);
    const lastState = newHistory[newHistory.length - 1];
    if (lastState) {
      ctx.putImageData(lastState, 0, 0);
      setHistory(newHistory);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const handleSaveDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsUploading(true);
    setErrorMsg('');

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsUploading(false);
        setErrorMsg('Failed to export drawing.');
        return;
      }

      try {
        const url = await api.uploadFile(blob, `drawing-${Date.now()}.png`);
        setDrawingPreviewUrl(url);
        onDrawingSaved(url);
        setIsUploading(false);
      } catch (err: any) {
        setErrorMsg(err.message || 'Error saving drawing.');
        setIsUploading(false);
      }
    }, 'image/png');
  };

  const handleDiscardDrawing = () => {
    setDrawingPreviewUrl(null);
    clearCanvas();
    if (onRemoveDrawing) onRemoveDrawing();
  };

  return (
    <div className="p-6 rounded-3xl bg-white border-3 border-[#FFE4E8] space-y-4 shadow-scrapbook">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm font-display font-bold text-[#332C35]">
          <Palette className="w-5 h-5 text-[#8E24AA]" />
          <span>Doodle & Drawing Canvas</span>
        </div>

        {drawingPreviewUrl && (
          <button
            type="button"
            onClick={handleDiscardDrawing}
            className="text-xs font-display text-rose-500 hover:underline flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Drawing</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 text-xs font-display">
          {errorMsg}
        </div>
      )}

      {!drawingPreviewUrl && (
        <>
          {/* Palette & Tools Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FFF0F3] rounded-2xl border border-[#FFB6C1]/50">
            {/* Color Palette */}
            <div className="flex items-center space-x-1.5">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => {
                    setColor(c.hex);
                    setIsEraser(false);
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    !isEraser && color === c.hex ? 'scale-125 border-[#332C35]' : 'border-white'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>

            {/* Brush Size */}
            <div className="flex items-center space-x-2">
              {[3, 6, 12].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setBrushSize(size)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-display font-bold border ${
                    brushSize === size ? 'bg-[#332C35] text-white' : 'bg-white text-[#7A6E7D]'
                  }`}
                >
                  {size === 3 ? 'Thin' : size === 6 ? 'Mid' : 'Thick'}
                </button>
              ))}
            </div>

            {/* Eraser & Actions */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsEraser(!isEraser)}
                className={`p-1.5 rounded-xl border text-xs font-display ${
                  isEraser ? 'bg-[#332C35] text-white' : 'bg-white text-[#7A6E7D]'
                }`}
                title="Eraser"
              >
                <Eraser className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={undo}
                disabled={history.length <= 1}
                className="p-1.5 rounded-xl bg-white border text-[#7A6E7D] disabled:opacity-40"
                title="Undo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={clearCanvas}
                className="p-1.5 rounded-xl bg-white border text-rose-500"
                title="Clear Canvas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Responsive HTML5 Canvas */}
          <div className="relative w-full rounded-2xl border-2 border-[#FFE4E8] overflow-hidden bg-white touch-none">
            <canvas
              ref={canvasRef}
              width={600}
              height={300}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[250px] cursor-crosshair block bg-white"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleSaveDrawing}
              disabled={isUploading}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#8E24AA] text-white font-display font-bold text-xs hover:bg-[#7B1FA2] shadow-xs disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isUploading ? 'Saving Drawing...' : 'Attach Drawing to Memory'}</span>
            </button>
          </div>
        </>
      )}

      {/* Preview Attached Drawing */}
      {drawingPreviewUrl && (
        <div className="p-3 rounded-2xl border-2 border-[#FFE4E8] bg-white text-center">
          <img
            src={drawingPreviewUrl}
            alt="My Drawing"
            className="max-h-48 mx-auto rounded-xl border border-[#FFE4E8] object-contain"
          />
          <div className="text-xs text-[#8E24AA] font-display font-bold pt-2 flex items-center justify-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Drawing attached to memory</span>
          </div>
        </div>
      )}
    </div>
  );
};

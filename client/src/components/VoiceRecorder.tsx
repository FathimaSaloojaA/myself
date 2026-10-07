import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Check, AlertCircle } from 'lucide-react';
import { api } from '../services/api.js';

interface VoiceRecorderProps {
  onAudioSaved: (url: string) => void;
  existingAudioUrl?: string;
  onRemoveAudio?: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onAudioSaved,
  existingAudioUrl,
  onRemoveAudio,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingAudioUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (existingAudioUrl) {
      setPreviewUrl(existingAudioUrl);
    }
  }, [existingAudioUrl]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    setErrorMsg('');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg('Voice recording is not supported in your browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg('Microphone access was denied. Please allow microphone permissions to record.');
      } else {
        setErrorMsg(err.message || 'Failed to start microphone recording.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current && previewUrl) {
      const player = new Audio(previewUrl);
      audioPlayerRef.current = player;
      player.onended = () => setIsPlaying(false);
    }

    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
        setIsPlaying(false);
      } else {
        audioPlayerRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSaveAudio = async () => {
    if (!audioBlob) return;
    setIsUploading(true);
    setErrorMsg('');

    try {
      const uploadedUrl = await api.uploadFile(audioBlob, `voice-memory-${Date.now()}.webm`);
      onAudioSaved(uploadedUrl);
      setIsUploading(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload voice recording.');
      setIsUploading(false);
    }
  };

  const handleDiscard = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    setAudioBlob(null);
    setPreviewUrl(null);
    setIsPlaying(false);
    setRecordingTime(0);
    if (onRemoveAudio) onRemoveAudio();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 rounded-3xl bg-white border-3 border-[#FFE4E8] space-y-4 shadow-scrapbook">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm font-display font-bold text-[#332C35]">
          <Mic className="w-5 h-5 text-[#0288D1]" />
          <span>Voice Memory</span>
        </div>

        {isRecording && (
          <span className="flex items-center space-x-2 text-xs font-display font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Recording {formatTime(recordingTime)}</span>
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 text-xs font-display flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!previewUrl && !isRecording && (
        <button
          type="button"
          onClick={startRecording}
          className="w-full py-4 rounded-2xl bg-[#E1F5FE] border-2 border-[#81D4FA] text-[#0288D1] font-display font-bold flex items-center justify-center space-x-2.5 hover:bg-[#B3E5FC] transition-all shadow-xs"
        >
          <Mic className="w-5 h-5" />
          <span>Record my voice</span>
        </button>
      )}

      {isRecording && (
        <button
          type="button"
          onClick={stopRecording}
          className="w-full py-4 rounded-2xl bg-rose-500 text-white font-display font-bold flex items-center justify-center space-x-2.5 hover:bg-rose-600 transition-all shadow-md animate-pulse"
        >
          <Square className="w-5 h-5 fill-white" />
          <span>Stop recording ({formatTime(recordingTime)})</span>
        </button>
      )}

      {previewUrl && !isRecording && (
        <div className="p-4 rounded-2xl bg-[#F5F5F5] border-2 border-[#E0E0E0] space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={togglePlayback}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-[#E0E0E0] text-[#332C35] font-display font-bold text-xs hover:bg-[#FAFAFA]"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-[#0288D1]" /> : <Play className="w-4 h-4 text-[#0288D1]" />}
              <span>{isPlaying ? 'Pause' : 'Play Voice Memory'}</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleDiscard}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                title="Discard recording"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {audioBlob && (
                <button
                  type="button"
                  onClick={handleSaveAudio}
                  disabled={isUploading}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#0288D1] text-white font-display font-bold text-xs hover:bg-[#0277BD] disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading...' : 'Attach Audio'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

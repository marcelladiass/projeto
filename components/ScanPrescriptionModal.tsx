import React, { useState, useRef, useEffect, useCallback } from 'react';
import { parsePrescription } from '../services/geminiService';
import { ScannedMedication } from '../types';
import { IconCamera, IconLoader } from './Icons';

interface ScanPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (meds: ScannedMedication[]) => void;
}

const ScanPrescriptionModal: React.FC<ScanPrescriptionModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cleanupCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      const startCamera = async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setError("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.");
        }
      };
      startCamera();
    } else {
      cleanupCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    return () => cleanupCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCaptureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsLoading(true);
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if(context){
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64Image = dataUrl.split(',')[1];

        try {
            const meds = await parsePrescription(base64Image);
            if (meds && meds.length > 0) {
              onScanSuccess(meds);
            } else {
              setError("Nenhum medicamento encontrado. Tente novamente com uma imagem mais clara e focada.");
            }
        } catch (e: any) {
            setError(e.message || "Ocorreu um erro ao processar a imagem.");
        } finally {
            setIsLoading(false);
        }
    } else {
         setError("Não foi possível processar a imagem da câmera.");
         setIsLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg m-4 transform transition-all animate-fade-in-up flex flex-col">
        <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Escanear Receita Médica</h2>
        </div>
        <div className="p-4 flex-grow">
            <p className="text-center text-gray-600 mb-4 text-sm">Posicione a receita dentro da área da câmera e garanta que o texto esteja nítido e bem iluminado.</p>
            <div className="relative w-full aspect-video bg-gray-900 rounded-md overflow-hidden">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
                {isLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center">
                        <IconLoader className="h-10 w-10 text-white" />
                        <p className="text-white mt-3 font-semibold">Analisando...</p>
                    </div>
                )}
            </div>
            {error && <p className="text-red-500 text-center mt-3 text-sm font-medium">{error}</p>}
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors" disabled={isLoading}>
                Cancelar
            </button>
            <button 
                onClick={handleCaptureAndScan}
                disabled={isLoading || !!error || !stream}
                className="px-6 py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
                <IconCamera className="h-5 w-5 mr-2" />
                {isLoading ? 'Processando...' : 'Capturar e Analisar'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ScanPrescriptionModal;

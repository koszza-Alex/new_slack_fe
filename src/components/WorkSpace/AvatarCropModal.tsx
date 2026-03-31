"use client";

import Cropper from "react-easy-crop";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
    open: boolean;
    image: string | null;
    onClose: () => void;
    onSave: (blob: Blob) => void;
};

export default function AvatarCropModal({
    open,
    image,
    onClose,
    onSave,
}: Props) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const onCropComplete = useCallback((_: any, area: any) => {
        setCroppedAreaPixels(area);
    }, []);

    const createImage = (url: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });

    const getCroppedBlob = async () => {
        if (!image || !croppedAreaPixels) return null;

        const img = await createImage(image);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const size = 256;
        canvas.width = size;
        canvas.height = size;

        ctx?.drawImage(
            img,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            size,
            size,
        );

        return new Promise<Blob | null>((resolve) => {
            canvas.toBlob((blob) => resolve(blob), "image/png");
        });
    };

    // Reset state on open
    useEffect(() => {
        if (open) {
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedAreaPixels(null);
            setPreview(null);
        }
    }, [open]);

    // Preview generation with animation trigger
    useEffect(() => {
        if (!image || !croppedAreaPixels) return;

        let active = true;

        (async () => {
            const blob = await getCroppedBlob();
            if (!blob || !active) return;

            const url = URL.createObjectURL(blob);

            setPreview((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return url;
            });
        })();

        return () => {
            active = false;
        };
    }, [croppedAreaPixels, image]);

    const handleSave = async () => {
        if (!croppedAreaPixels) return;

        const blob = await getCroppedBlob();
        if (blob) {
            console.log("blob===>", blob);

            onSave(blob);
            onClose();
        }
    };

    // Mouse wheel zoom
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = -e.deltaY * 0.001;
        setZoom((z) => Math.min(3, Math.max(1, z + delta)));
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <motion.div
                        className="fixed z-50 top-1/2 left-1/2 w-[540px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                    >
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h2 className="text-[18px] font-semibold">
                                Add a profile photo
                            </h2>
                            <button onClick={onClose}>✕</button>
                        </div>

                        <div className="px-6 py-5 relative">
                            <div
                                className="relative w-full h-[340px] bg-[#1D1C1D] rounded-md overflow-hidden"
                                onWheel={handleWheel}
                            >
                                {image && (
                                    <Cropper
                                        image={image}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        cropShape="round"
                                        showGrid={false}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                    />
                                )}
                            </div>

                            {preview && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute bottom-6 left-6 bg-white shadow-lg rounded-lg px-3 py-2 flex items-center gap-3"
                                >
                                    <img
                                        src={preview}
                                        className="w-[40px] h-[40px] rounded-md"
                                    />
                                    <div className="text-xs">
                                        <div className="font-medium">
                                            Preview
                                        </div>
                                        <div className="text-gray-500">
                                            This is how it will look
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.01}
                                value={zoom}
                                onChange={(e) =>
                                    setZoom(Number(e.target.value))
                                }
                                className="w-full mt-4"
                            />
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 border-t">
                            <button onClick={onClose}>Cancel</button>
                            <button
                                onClick={handleSave}
                                disabled={!croppedAreaPixels}
                                className={`px-4 py-2 rounded-md text-white ${
                                    croppedAreaPixels
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                Apply
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

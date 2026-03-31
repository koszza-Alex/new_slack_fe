"use client";

import { useEffect, useState } from "react";
import AvatarCropModal from "./AvatarCropModal";

type Props = {
    open: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    userdata: any;
};

export default function EditProfileModal({
    open,
    onClose,
    onSave,
    userdata,
}: Props) {
    const [form, setForm] = useState({
        name: "",
        dispname: "",
        title: "",
        pronunciation: "",
        timezone: "UTC-08:00",
    });
    const [cropOpen, setCropOpen] = useState(false);
    const [rawImage, setRawImage] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    const [avatar, setAvatar] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // ESC close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!open) return null;

    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };
    const handleAvatarChange = (file: File) => {
        if (rawImage) URL.revokeObjectURL(rawImage);

        const url = URL.createObjectURL(file);
        setRawImage(url);
        setCropOpen(true);
    };

    const handleSubmit = () => {
        if (!form.dispname.trim()) {
            alert("dispname name is required");
            return;
        }

        const payload = {
            ...form,
            name: form.name.trim(),
            dispname: form.dispname.trim() || form.name.trim(),
            avatar,
        };

        console.log("payload====>", payload);

        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
            {/* Modal */}
            <div className="w-[720px] bg-white rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-[20px] font-semibold">
                        Edit your profile
                    </h2>
                    <button onClick={onClose} className="text-gray-500 text-xl">
                        ✕
                    </button>
                </div>

                <div className="flex px-6 py-5 gap-6">
                    {/* LEFT FORM */}
                    <div className="flex-1 space-y-4">
                        {/* Full name */}
                        <div>
                            <label className="text-sm font-medium">
                                Full name
                            </label>
                            <input
                                value={form.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Display name */}
                        <div>
                            <label className="text-sm font-medium">
                                Display name
                            </label>
                            <input
                                value={form.dispname}
                                onChange={(e) =>
                                    handleChange("dispname", e.target.value)
                                }
                                className="w-full mt-1 px-3 py-2 border rounded-md"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                This could be your first name, or a nickname.
                            </p>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="text-sm font-medium">Title</label>
                            <input
                                value={form.title}
                                onChange={(e) =>
                                    handleChange("title", e.target.value)
                                }
                                className="w-full mt-1 px-3 py-2 border rounded-md"
                                placeholder="Title"
                            />
                        </div>

                        {/* Recording */}
                        <div>
                            <label className="text-sm font-medium">
                                Name recording
                            </label>
                            <button className="mt-1 px-3 py-2 border rounded-md text-sm">
                                🎤 Record Audio Clip
                            </button>
                        </div>

                        {/* Pronunciation */}
                        <div>
                            <label className="text-sm font-medium">
                                Name pronunciation
                            </label>
                            <input
                                value={form.pronunciation}
                                onChange={(e) =>
                                    handleChange(
                                        "pronunciation",
                                        e.target.value,
                                    )
                                }
                                className="w-full mt-1 px-3 py-2 border rounded-md"
                                placeholder="Zoe (pronounced 'zo-ee')"
                            />
                        </div>

                        {/* Timezone */}
                        <div>
                            <label className="text-sm font-medium">
                                Time zone
                            </label>
                            <select
                                value={form.timezone}
                                onChange={(e) =>
                                    handleChange("timezone", e.target.value)
                                }
                                className="w-full mt-1 px-3 py-2 border rounded-md"
                            >
                                <option value="UTC-08:00">
                                    (UTC-08:00) Pacific Time (US and Canada)
                                </option>
                                <option value="UTC-05:00">
                                    (UTC-05:00) Eastern Time
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* RIGHT SIDE (PHOTO) */}
                    <div className="w-[180px]">
                        <div className="text-sm font-medium mb-2">
                            Profile photo
                        </div>

                        <div className="w-[160px] h-[160px] bg-[#7B2B8F] rounded-md overflow-hidden flex items-center justify-center">
                            {preview ? (
                                <img
                                    src={preview}
                                    className="w-full h-full object-cover"
                                />
                            ) : userdata?.avatar ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_SOCKET_URL}${userdata.avatar}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-[80px] h-[80px] bg-white rounded-full" />
                            )}
                        </div>

                        <input
                            type="file"
                            hidden
                            id="avatarUpload"
                            onChange={(e) =>
                                e.target.files &&
                                handleAvatarChange(e.target.files[0])
                            }
                        />

                        <label
                            htmlFor="avatarUpload"
                            className="block mt-3 text-center border rounded-md py-2 text-sm cursor-pointer hover:bg-gray-100"
                        >
                            Upload Photo
                        </label>

                        <button
                            onClick={() => {
                                setAvatar(null);
                                setPreview(null);
                            }}
                            className="block mt-2 text-sm text-blue-600 text-center"
                        >
                            Remove Photo
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md text-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
            <AvatarCropModal
                open={cropOpen}
                image={rawImage}
                onClose={() => {
                    setCropOpen(false);

                    // cleanup temp image
                    if (rawImage) URL.revokeObjectURL(rawImage);
                }}
                onSave={(croppedBlob: Blob) => {
                    const previewUrl = URL.createObjectURL(croppedBlob);

                    setPreview((prev) => {
                        if (prev) URL.revokeObjectURL(prev);
                        return previewUrl;
                    });

                    setAvatar(
                        new File([croppedBlob], "avatar.png", {
                            type: "image/png",
                        }),
                    );

                    setCropOpen(false);
                }}
            />
        </div>
    );
}

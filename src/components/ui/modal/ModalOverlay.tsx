"use client";

interface ModalOverlayProps {
    onClose: () => void;
    children: React.ReactNode;
    /** Extra classes for the inner container */
    className?: string;
}

/**
 * Reusable modal shell: fixed backdrop + centered content container.
 * Clicking the backdrop calls onClose.
 */
export default function ModalOverlay({ onClose, children, className = "" }: ModalOverlayProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className={`relative z-10 bg-white rounded-lg shadow-xl ${className}`}>
                {children}
            </div>
        </div>
    );
}

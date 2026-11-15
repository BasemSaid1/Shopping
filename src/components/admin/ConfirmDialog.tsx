"use client";

import { FaSpinner } from "react-icons/fa";
import AdminModal from "./AdminModal";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "حذف",
  busy,
  error,
  onConfirm,
  onClose,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  busy: boolean;
  error?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <AdminModal title={title} onClose={busy ? () => {} : onClose}>
      <p className="text-sm leading-7 text-gray-600">{message}</p>
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {busy && <FaSpinner className="animate-spin" />}
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="rounded-lg bg-gray-100 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-60"
        >
          إلغاء
        </button>
      </div>
    </AdminModal>
  );
}

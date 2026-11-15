import { FaBoxOpen, FaExclamationTriangle, FaSyncAlt } from "react-icons/fa";

export function ListSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl bg-gray-100 p-4">
          <div className="mx-auto h-24 w-24 rounded-full bg-gray-200" />
          <div className="mx-auto mt-4 h-4 w-2/3 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export function ListError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-red-50 py-16 text-red-600">
      <FaExclamationTriangle className="text-4xl" />
      <p className="font-semibold">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-1 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        <FaSyncAlt /> إعادة المحاولة
      </button>
    </div>
  );
}

export function ListEmpty({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-gray-50 py-16 text-gray-500">
      <FaBoxOpen className="text-5xl" />
      <p className="font-semibold">{text}</p>
    </div>
  );
}

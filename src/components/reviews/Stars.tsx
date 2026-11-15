import { FaRegStar, FaStar } from "react-icons/fa";

export default function Stars({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex gap-0.5 text-yellow-400 ${className}`}
      role="img"
      aria-label={`${value} من 5`}
    >
      {[1, 2, 3, 4, 5].map((n) =>
        n <= Math.round(value) ? <FaStar key={n} /> : <FaRegStar key={n} />,
      )}
    </span>
  );
}

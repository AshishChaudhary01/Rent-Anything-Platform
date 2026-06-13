import { IoSearchOutline } from "react-icons/io5";

interface RaSearchBarProps {
  placeholderText?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: () => void;
  styleClass?: string;
}

const RaSearchBar = ({
  placeholderText = "Search...",
  value,
  onChange,
  onSubmit,
  styleClass = "",
}: RaSearchBarProps) => {
  return (
    <div
      className={`
         flex items-center gap-2
        bg-surface
        border border-gray-300
        rounded-full
        px-4 py-2
        focus-within:border-muted
        transition
        ${styleClass}
      `}
    >
      {/* Icon */}
      <IoSearchOutline className="size-5 text-muted" />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholderText}
        className="
          w-full
          bg-transparent
          outline-none
          text-sm
          text-text-dark
          placeholder:text-muted
        "
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) {
            onSubmit();
          }
        }}
      />
    </div>
  );
};

export default RaSearchBar;
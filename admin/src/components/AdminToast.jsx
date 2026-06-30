export default function AdminToast({ message, type = "success" }) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      className={`fo-absolute fo-bottom-6 fo-right-6 fo-z-50 fo-max-w-sm fo-rounded-xl fo-px-4 fo-py-3 fo-text-sm fo-font-medium fo-shadow-lg ${
        type === "error"
          ? "fo-bg-red-600 fo-text-white"
          : "fo-bg-emerald-600 fo-text-white"
      }`}
    >
      {message}
    </div>
  );
}

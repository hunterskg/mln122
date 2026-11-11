'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body className="bg-stone-950 text-white flex items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold">Đã xảy ra lỗi</h2>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}

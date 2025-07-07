import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-6">Language Not Supported</h2>
        <p className="text-gray-300 mb-8">
          The requested language is not available. Please select from our
          supported languages.
        </p>
        <div className="space-x-4">
          <Link
            href="/en/static"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 inline-block"
          >
            🇺🇸 English
          </Link>
          <Link
            href="/pt/static"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 inline-block"
          >
            🇧🇷 Português
          </Link>
        </div>
        <div className="mt-8">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

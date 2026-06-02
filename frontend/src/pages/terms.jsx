import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">BookIn Library System Terms & Conditions</h1>

        <p className="text-sm text-gray-700 mb-3">Welcome to the BookIn digital library service. By using this service, you agree to the following terms and conditions:</p>

        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 mb-4">
          <li>Accounts must be registered with accurate information. Misuse of accounts may result in suspension or deletion.</li>
          <li>Users are responsible for returning books on time. Loan extensions can be requested through the extension feature and will be processed by the admin according to the library's policies.</li>
          <li>Extension requests are not always approved — the admin may reject them based on availability or borrowing rules.</li>
          <li>Digital content and other services are for personal and non-commercial use only. Copyright violations will be addressed according to applicable laws.</li>
          <li>The library reserves the right to change these terms and conditions at any time. Changes will be announced through notifications in the application.</li>
        </ol>

        <p className="text-sm text-gray-600">If you agree, proceed with account creation or contact the admin if you have any questions.</p>

        <div className="mt-6 flex justify-end">
          <Link to="/login" className="text-sm text-blue-700 hover:underline">
            I Agree
          </Link>
        </div>
      </div>
    </div>
  );
}

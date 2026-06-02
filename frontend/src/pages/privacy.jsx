import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">BookIn Privacy Policy</h1>

        <p className="text-sm text-gray-700 mb-3">We value your privacy. This policy explains how user information is collected, used, and protected by the BookIn library system.</p>

        <h3 className="font-semibold mt-3">Information Collected</h3>
        <p className="text-sm text-gray-700 mb-2">We collect registration data (name, email, phone number), as well as book borrowing data.</p>

        <h3 className="font-semibold mt-3">Use of Data</h3>
        <p className="text-sm text-gray-700 mb-2">Data is used to manage accounts, process borrowing/extension requests, and send notifications related to the service.</p>

        <h3 className="font-semibold mt-3">Security</h3>
        <p className="text-sm text-gray-700 mb-2">We implement technical measures and policies to protect data. However, please also ensure the security of your own account (e.g., do not share your password).</p>

        <h3 className="font-semibold mt-3">Data Sharing</h3>
        <p className="text-sm text-gray-700 mb-2">We do not share personal data with third parties unless required by law or for service operational purposes (e.g., physical book delivery if applicable).</p>

        <div className="mt-6 flex justify-end">
          <Link to="/login" className="text-sm text-blue-700 hover:underline">
            I Agree
          </Link>
        </div>
      </div>
    </div>
  );
}

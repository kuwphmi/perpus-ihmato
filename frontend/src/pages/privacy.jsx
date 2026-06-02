import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">Kebijakan Privasi BookIn</h1>

        <p className="text-sm text-gray-700 mb-3">
          Kami menghargai privasi Anda. Kebijakan ini menjelaskan bagaimana informasi pengguna dikumpulkan, digunakan,
          dan dilindungi oleh sistem perpustakaan BookIn.
        </p>

        <h3 className="font-semibold mt-3">Informasi yang Dikumpulkan</h3>
        <p className="text-sm text-gray-700 mb-2">Kami mengumpulkan data pendaftaran (nama, email, nomor telepon), serta data peminjaman buku.</p>

        <h3 className="font-semibold mt-3">Penggunaan Data</h3>
        <p className="text-sm text-gray-700 mb-2">Data digunakan untuk mengelola akun, memproses peminjaman/perpanjangan, dan mengirim notifikasi terkait layanan.</p>

        <h3 className="font-semibold mt-3">Keamanan</h3>
        <p className="text-sm text-gray-700 mb-2">Kami menerapkan langkah teknis dan kebijakan untuk melindungi data. Namun mohon pastikan keamanan
        akun Anda sendiri (mis. jangan membagikan password).</p>

        <h3 className="font-semibold mt-3">Berbagi Data</h3>
        <p className="text-sm text-gray-700 mb-2">Kami tidak membagikan data pribadi ke pihak ketiga kecuali diperlukan oleh hukum atau untuk
        operasional layanan (mis. pengiriman buku fisik jika ada).</p>

        <div className="mt-6 flex justify-end">
          <Link to="/login" className="text-sm text-blue-700 hover:underline">
            Kembali
          </Link>
        </div>
      </div>
    </div>
  );
}

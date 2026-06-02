import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">Syarat & Ketentuan Sistem Perpustakaan BookIn</h1>

<<<<<<< HEAD
        <p className="text-sm text-gray-700 mb-3">
          Selamat datang di layanan perpustakaan digital BookIn. Dengan menggunakan layanan ini, Anda menyetujui syarat dan
          ketentuan berikut:
        </p>

        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 mb-4">
          <li>
            Akun harus didaftarkan dengan data yang benar. Penyalahgunaan akun dapat berakibat penangguhan atau penghapusan
            akun.
          </li>
          <li>
            Pengguna bertanggung jawab untuk mengembalikan buku tepat waktu. Perpanjangan peminjaman dapat diajukan melalui
            fitur perpanjangan, dan akan diproses oleh admin sesuai kebijakan perpustakaan.
          </li>
          <li>
            Permintaan perpanjangan tidak selalu disetujui — admin dapat menolak berdasarkan ketersediaan atau aturan
            peminjaman.
          </li>
          <li>
            Konten digital dan layanan lain hanya untuk penggunaan pribadi dan non-komersial. Pelanggaran hak cipta akan
            ditindak sesuai hukum yang berlaku.
          </li>
          <li>
            Perpustakaan berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan diumumkan melalui notifikasi
            di aplikasi.
          </li>
=======
        <p className="text-sm text-gray-700 mb-3">Selamat datang di layanan perpustakaan digital BookIn. Dengan menggunakan layanan ini, Anda menyetujui syarat dan ketentuan berikut:</p>

        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 mb-4">
          <li>Akun harus didaftarkan dengan data yang benar. Penyalahgunaan akun dapat berakibat penangguhan atau penghapusan akun.</li>
          <li>Pengguna bertanggung jawab untuk mengembalikan buku tepat waktu. Perpanjangan peminjaman dapat diajukan melalui fitur perpanjangan, dan akan diproses oleh admin sesuai kebijakan perpustakaan.</li>
          <li>Permintaan perpanjangan tidak selalu disetujui — admin dapat menolak berdasarkan ketersediaan atau aturan peminjaman.</li>
          <li>Konten digital dan layanan lain hanya untuk penggunaan pribadi dan non-komersial. Pelanggaran hak cipta akan ditindak sesuai hukum yang berlaku.</li>
          <li>Perpustakaan berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan diumumkan melalui notifikasi di aplikasi.</li>
>>>>>>> 4d012e17f440b5368df25b390f7daaa5f76f4fe9
        </ol>

        <p className="text-sm text-gray-600">Jika Anda setuju, lanjutkan pembuatan akun atau hubungi admin jika ada pertanyaan.</p>

        <div className="mt-6 flex justify-end">
          <Link to="/login" className="text-sm text-blue-700 hover:underline">
            Kembali
          </Link>
        </div>
      </div>
    </div>
  );
}

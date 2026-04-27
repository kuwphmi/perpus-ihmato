import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const tabs = [
  { key: "pinjaman", label: "Daftar Pinjaman" },
  { key: "anggota", label: "Anggota" },
  { key: "pengembalian", label: "Buku Dikembalikan" },
  { key: "ajukan", label: "Ajukan Peminjaman" },
  { key: "perpanjangan", label: "Perpanjangan" },
  { key: "print", label: "Print Data" },
];

const emptyForm = {
  member_id: "",
  book_id: "",
  loan_date: "",
  due_date: "",
  notes: "",
};

const emptyExtensionForm = {
  loan_id: "",
  new_due_date: "",
  reason: "",
};

export default function AdminPerpustakaan() {
  const [activeTab, setActiveTab] = useState("pinjaman");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const [data, setData] = useState({
    loans: [],
    members: [],
    returns: [],
    loanRequests: [],
    extensionRequests: [],
    summary: {
      total_loans: 0,
      total_members: 0,
      total_returns: 0,
      total_requests: 0,
    },
  });

  const [loanForm, setLoanForm] = useState(emptyForm);
  const [extensionForm, setExtensionForm] = useState(emptyExtensionForm);

  const fetchJson = async (url, options = {}) => {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...options,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Request gagal");
    }

    return res.json();
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashboard, loans, members, returnsData, loanRequests, extensionRequests] = await Promise.all([
        fetchJson(`${API_BASE}/admin/dashboard`),
        fetchJson(`${API_BASE}/admin/loans`),
        fetchJson(`${API_BASE}/admin/members`),
        fetchJson(`${API_BASE}/admin/returns`),
        fetchJson(`${API_BASE}/admin/loan-requests`),
        fetchJson(`${API_BASE}/admin/extension-requests`),
      ]);

      setData({
        loans,
        members,
        returns: returnsData,
        loanRequests,
        extensionRequests,
        summary: dashboard,
      });
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const badgeClass = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("approved") || s.includes("selesai") || s.includes("returned")) {
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
    if (s.includes("pending") || s.includes("menunggu")) {
      return "bg-amber-100 text-amber-700 border-amber-200";
    }
    if (s.includes("rejected") || s.includes("ditolak")) {
      return "bg-rose-100 text-rose-700 border-rose-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    const match = (item) =>
      Object.values(item).some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(q),
      );

    if (activeTab === "pinjaman") return data.loans.filter(match);
    if (activeTab === "anggota") return data.members.filter(match);
    if (activeTab === "pengembalian") return data.returns.filter(match);
    if (activeTab === "ajukan") return data.loanRequests.filter(match);
    if (activeTab === "perpanjangan") return data.extensionRequests.filter(match);

    return [];
  }, [activeTab, data, query]);

  const submitLoanRequest = async (e) => {
    e.preventDefault();
    try {
      await fetchJson(`${API_BASE}/admin/loan-requests`, {
        method: "POST",
        body: JSON.stringify(loanForm),
      });
      alert("Pengajuan peminjaman berhasil dibuat.");
      setLoanForm(emptyForm);
      await loadData();
      setActiveTab("pinjaman");
    } catch (err) {
      console.error(err);
      alert("Gagal mengajukan peminjaman.");
    }
  };

  const submitExtensionRequest = async (e) => {
    e.preventDefault();
    try {
      await fetchJson(`${API_BASE}/admin/extension-requests`, {
        method: "POST",
        body: JSON.stringify(extensionForm),
      });
      alert("Pengajuan perpanjangan berhasil dibuat.");
      setExtensionForm(emptyExtensionForm);
      await loadData();
      setActiveTab("perpanjangan");
    } catch (err) {
      console.error(err);
      alert("Gagal mengajukan perpanjangan.");
    }
  };

  const approveLoanRequest = async (id) => {
    try {
      await fetchJson(`${API_BASE}/admin/loan-requests/${id}/approve`, {
        method: "POST",
      });
      alert("Pengajuan peminjaman disetujui.");
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Gagal menyetujui pengajuan.");
    }
  };

  const approveExtension = async (id) => {
    try {
      await fetchJson(`${API_BASE}/admin/extension-requests/${id}/approve`, {
        method: "POST",
      });
      alert("Perpanjangan disetujui.");
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Gagal menyetujui perpanjangan.");
    }
  };

  const handlePrint = () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    window.location.href = `${API_BASE}/admin/report/monthly/pdf?month=${month}&year=${year}`;
  };

  const StatCard = ({ title, value, subtitle }) => (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
    </div>
  );

  const Table = ({ columns, rows, emptyText, actions = false }) => (
    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-blue-50 text-blue-900">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold">
                  {col.label}
                </th>
              ))}
              {actions && <th className="px-4 py-3 font-semibold">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-8 text-center text-slate-500">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-700">
                      {col.render ? col.render(row) : (row[col.key] ?? "-")}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3">
                      {row._type === "loan_request" && (
                        <button onClick={() => approveLoanRequest(row.id)} className="rounded-xl bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">
                          Setujui
                        </button>
                      )}
                      {row._type === "extension_request" && row.status === "pending" && (
                      <button
                        onClick={() => approveExtension(row.id)}
                        className="rounded-xl bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                      >
                        Setujui
                      </button>
                    )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const columnsByTab = {
    pinjaman: [
      { key: "id", label: "ID" },
      { key: "member_name", label: "Anggota" },
      { key: "book_title", label: "Buku" },
      { key: "loan_date", label: "Tanggal Pinjam" },
      { key: "due_date", label: "Jatuh Tempo" },
      {
        key: "status",
        label: "Status",
        render: (row) => <span className={`rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(row.status)}`}>{row.status}</span>,
      },
    ],
    anggota: [
      { key: "id", label: "ID" },
      { key: "name", label: "Nama" },
      { key: "member_code", label: "Kode Anggota" },
      { key: "phone", label: "Telepon" },
      { key: "status", label: "Status" },
    ],
    pengembalian: [
      { key: "id", label: "ID" },
      { key: "member_name", label: "Anggota" },
      { key: "book_title", label: "Buku" },
      { key: "return_date", label: "Tanggal Kembali" },
      { key: "fine", label: "Denda" },
    ],
    ajukan: [
      { key: "id", label: "ID" },
      { key: "member_name", label: "Anggota" },
      { key: "book_title", label: "Buku" },
      { key: "request_date", label: "Tanggal Ajukan" },
      {
        key: "status",
        label: "Status",
        render: (row) => <span className={`rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(row.status)}`}>{row.status}</span>,
      },
    ],
    perpanjangan: [
      { key: "id", label: "ID" },
      { key: "member_name", label: "Anggota" },
      { key: "book_title", label: "Buku" },
      { key: "old_due_date", label: "Tempo Lama" },
      { key: "new_due_date", label: "Tempo Baru" },
      {
        key: "status",
        label: "Status",
        render: (row) => <span className={`rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(row.status)}`}>{row.status}</span>,
      },
    ],
  };

  const rowsByTab = {
    pinjaman: data.loans,
    anggota: data.members,
    pengembalian: data.returns,
    ajukan: data.loanRequests.map((x) => ({ ...x, _type: "loan_request" })),
    perpanjangan: data.extensionRequests.map((x) => ({ ...x, _type: "extension_request" })),
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white text-slate-900 print:bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-blue-100 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between print:border-0 print:shadow-none">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Admin Perpustakaan</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola pinjaman, anggota, pengembalian, pengajuan, dan perpanjangan.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari data..." className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 outline-none ring-0 focus:border-blue-500 sm:w-72" />
            <button onClick={handlePrint} className="rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 print:hidden">
              Print Data
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4 print:hidden">
          <StatCard title="Total Pinjaman" value={data.summary.total_loans} subtitle="Data aktif di sistem" />
          <StatCard title="Total Anggota" value={data.summary.total_members} subtitle="Anggota terdaftar" />
          <StatCard title="Buku Dikembalikan" value={data.summary.total_returns} subtitle="Transaksi selesai" />
          <StatCard title="Total Pengajuan" value={data.summary.total_requests} subtitle="Pinjaman + perpanjangan" />
        </div>

        <div className="mb-6 flex flex-wrap gap-2 print:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${activeTab === tab.key ? "bg-blue-600 text-white shadow" : "bg-white text-slate-700 border border-blue-100 hover:bg-blue-50"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-blue-100 bg-white p-10 text-center text-slate-500">Memuat data...</div>
        ) : (
          <>
            {activeTab === "ajukan" && (
              <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm print:hidden">
                <h2 className="text-lg font-semibold text-blue-900">Form Ajukan Peminjaman</h2>
                <form onSubmit={submitLoanRequest} className="mt-4 grid gap-4 md:grid-cols-2">
                  <input value={loanForm.member_id} onChange={(e) => setLoanForm({ ...loanForm, member_id: e.target.value })} placeholder="Member ID" className="rounded-2xl border border-blue-200 px-4 py-3" />
                  <input value={loanForm.book_id} onChange={(e) => setLoanForm({ ...loanForm, book_id: e.target.value })} placeholder="Book ID" className="rounded-2xl border border-blue-200 px-4 py-3" />
                  <input type="date" value={loanForm.loan_date} onChange={(e) => setLoanForm({ ...loanForm, loan_date: e.target.value })} className="rounded-2xl border border-blue-200 px-4 py-3" />
                  <input type="date" value={loanForm.due_date} onChange={(e) => setLoanForm({ ...loanForm, due_date: e.target.value })} className="rounded-2xl border border-blue-200 px-4 py-3" />
                  <textarea value={loanForm.notes} onChange={(e) => setLoanForm({ ...loanForm, notes: e.target.value })} placeholder="Catatan" className="rounded-2xl border border-blue-200 px-4 py-3 md:col-span-2" rows={3} />
                  <div className="md:col-span-2">
                    <button className="rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">Simpan Pengajuan</button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "perpanjangan" && (
              <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm print:hidden">
                <h2 className="text-lg font-semibold text-blue-900">Form Perpanjangan</h2>
                <form onSubmit={submitExtensionRequest} className="mt-4 grid gap-4 md:grid-cols-2">
                  <input value={extensionForm.loan_id} onChange={(e) => setExtensionForm({ ...extensionForm, loan_id: e.target.value })} placeholder="Loan ID" className="rounded-2xl border border-blue-200 px-4 py-3" />
                  <input type="date" value={extensionForm.new_due_date} onChange={(e) => setExtensionForm({ ...extensionForm, new_due_date: e.target.value })} className="rounded-2xl border border-blue-200 px-4 py-3" />
                  <textarea
                    value={extensionForm.reason}
                    onChange={(e) => setExtensionForm({ ...extensionForm, reason: e.target.value })}
                    placeholder="Alasan perpanjangan"
                    className="rounded-2xl border border-blue-200 px-4 py-3 md:col-span-2"
                    rows={3}
                  />
                  <div className="md:col-span-2">
                    <button className="rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">Simpan Perpanjangan</button>
                  </div>
                </form>
              </div>
            )}

            <div className="print:mt-0">
              <h2 className="mb-4 text-lg font-semibold text-blue-900">{tabs.find((t) => t.key === activeTab)?.label}</h2>
              <Table columns={columnsByTab[activeTab]} rows={rowsByTab[activeTab] ?? []} emptyText="Tidak ada data." actions={activeTab === "ajukan" || activeTab === "perpanjangan"} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
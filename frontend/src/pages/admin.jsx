import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, RotateCcw, ClipboardList, RefreshCcw, ShoppingCart, Search, Printer, ChevronLeft, ChevronRight, Menu, CheckCircle2, Clock3, Truck, PackageCheck, LibraryBig, LogOut, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const tabs = [
  { key: "buku", label: "Manage Books", icon: LibraryBig },
  { key: "pinjaman", label: "Borrowed", icon: BookOpen },
  { key: "anggota", label: "Members", icon: Users },
  { key: "pengembalian", label: "Returns", icon: RotateCcw },
  { key: "ajukan", label: "Borrow Requests", icon: ClipboardList },
  { key: "perpanjangan", label: "Renewals", icon: RefreshCcw },
  { key: "pesanan", label: "Orders", icon: ShoppingCart },
];

const ORDER_STATUSES = [
  { key: "waiting_payment", label: "Waiting Payment", color: "amber" },
  { key: "processing", label: "Processing", color: "blue" },
  { key: "shipping", label: "Shipping", color: "indigo" },
  { key: "completed", label: "Completed", color: "emerald" },
  { key: "cancelled", label: "Cancelled", color: "rose" },
];

const statColorMap = {
  blue: "text-blue-600 bg-blue-50",
  indigo: "text-indigo-600 bg-indigo-50",
  emerald: "text-emerald-600 bg-emerald-50",
  amber: "text-amber-600 bg-amber-50",
};

const getCurrentMonth = () => String(new Date().getMonth() + 1);
const getCurrentYear = () => String(new Date().getFullYear());

const tabToKey = {
  buku: "books",
  pinjaman: "loans",
  anggota: "members",
  pengembalian: "returns",
  ajukan: "loanRequests",
  perpanjangan: "extensionRequests",
  pesanan: "orders",
};

export default function AdminPerpustakaan() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pinjaman");
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingTabs, setLoadingTabs] = useState({});
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [selectedMonth] = useState(getCurrentMonth());
  const [selectedYear] = useState(getCurrentYear());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const profileRef = useRef(null);

  const adminUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const adminInitial = (adminUser?.name || "A").charAt(0).toUpperCase();

  const [loadedTabs, setLoadedTabs] = useState({
    books: false,
    loans: false,
    members: false,
    returns: false,
    loanRequests: false,
    extensionRequests: false,
    orders: false,
  });

  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    category: "",
    stock: "",
    price: "",
    description: "",
    cover: "",
  });

  const [data, setData] = useState({
    books: [],
    loans: [],
    members: [],
    returns: [],
    loanRequests: [],
    extensionRequests: [],
    orders: [],
    summary: {
      total_loans: 0,
      total_members: 0,
      total_returns: 0,
      total_requests: 0,
      total_orders: 0,
      pending_orders: 0,
    },
  });

  const addBook = async () => {
    try {
      await fetchJson(`${API_BASE}/admin/books`, {
        method: "POST",
        body: JSON.stringify(bookForm),
      });

      alert("Book added successfully");

      loadTabData("buku");

      setBookForm({
        title: "",
        author: "",
        category: "",
        stock: "",
        price: "",
        description: "",
        cover: "",
      });
    } catch {
      alert("Failed to add book");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchJson = async (url, options = {}) => {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      ...options,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Request failed");
    }
    return res.json();
  };

  const loadDashboard = useCallback(async () => {
    setLoadingDashboard(true);
    try {
      const dashboard = await fetchJson(`${API_BASE}/admin/dashboard`);
      setData((prev) => ({
        ...prev,
        summary: {
          ...dashboard,
          total_orders: dashboard.total_orders || 0,
          pending_orders: dashboard.pending_orders || 0,
        },
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  const loadTabData = useCallback(async (tabKey) => {
    const dataKey = tabToKey[tabKey];
    if (!dataKey) return;
    setLoadingTabs((prev) => ({ ...prev, [dataKey]: true }));
    try {
      let result = [];
      switch (tabKey) {
        case "buku":
          result = await fetchJson(`${API_BASE}/admin/books`);
          break;
        case "pinjaman":
          result = await fetchJson(`${API_BASE}/admin/loans`);
          break;
        case "anggota":
          result = await fetchJson(`${API_BASE}/admin/members`);
          break;
        case "pengembalian":
          result = await fetchJson(`${API_BASE}/admin/returns`);
          break;
        case "ajukan":
          result = await fetchJson(`${API_BASE}/admin/loan-requests`);
          break;
        case "perpanjangan":
          result = await fetchJson(`${API_BASE}/admin/extension-requests`);
          break;
        case "pesanan":
          result = await fetchJson(`${API_BASE}/admin/orders`).catch(() => []);
          break;
        default:
          result = [];
      }
      setData((prev) => ({ ...prev, [dataKey]: Array.isArray(result) ? result : [] }));
      setLoadedTabs((prev) => ({ ...prev, [dataKey]: true }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTabs((prev) => ({ ...prev, [dataKey]: false }));
    }
  }, []);

  const refreshCurrentView = useCallback(async () => {
    await Promise.all([loadDashboard(), loadTabData(activeTab)]);
  }, [activeTab, loadDashboard, loadTabData]);

  useEffect(() => {
    loadDashboard();
    if (!loadedTabs[tabToKey[activeTab]]) loadTabData(activeTab);
    const interval = setInterval(() => {
      loadDashboard();
      loadTabData(activeTab);
    }, 60000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const rejectLoanRequest = async (id) => {
    try {
      await fetchJson(`${API_BASE}/admin/loan-requests/${id}/reject`, { method: "POST" });
      await refreshCurrentView();
    } catch {
      alert("Failed.");
    }
  };
  const rejectExtension = async (id) => {
    try {
      await fetchJson(`${API_BASE}/admin/extension-requests/${id}/reject`, { method: "POST" });
      await refreshCurrentView();
    } catch {
      alert("Failed.");
    }
  };
  const approveLoanRequest = async (id) => {
    try {
      await fetchJson(`${API_BASE}/admin/loan-requests/${id}/approve`, { method: "POST" });
      await refreshCurrentView();
    } catch {
      alert("Failed.");
    }
  };
  const markAsReturned = async (id) => {
    try {
      await fetchJson(`${API_BASE}/admin/loans/${id}/return`, { method: "POST" });
      await refreshCurrentView();
    } catch {
      alert("Failed.");
    }
  };
  const approveExtension = async (id) => {
    try {
      await fetchJson(`${API_BASE}/admin/extension-requests/${id}/approve`, { method: "POST" });
      await refreshCurrentView();
    } catch {
      alert("Failed.");
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await fetchJson(`${API_BASE}/admin/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ order_status: status }) });
      await refreshCurrentView();
      if (selectedOrder?.id === id) setSelectedOrder((prev) => ({ ...prev, order_status: status }));
    } catch {
      alert("Failed to update order status.");
    }
  };

  const handlePrint = () => {
    window.open(`${API_BASE}/admin/report/monthly/pdf?month=${selectedMonth}&year=${selectedYear}`, "_blank", "noopener,noreferrer");
  };

  const badgeClass = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("approved") || s.includes("returned") || s.includes("completed")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (s.includes("pending") || s.includes("waiting")) return "bg-amber-100 text-amber-700 border-amber-200";
    if (s.includes("rejected") || s.includes("cancelled")) return "bg-rose-100 text-rose-700 border-rose-200";
    if (s.includes("processing")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (s.includes("shipping")) return "bg-indigo-100 text-indigo-700 border-indigo-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getStatusLabel = (status) => {
    const map = {
      pending: "Pending",
      processing: "Processing",
      shipping: "Shipping",
      completed: "Completed",
      cancelled: "Cancelled",
      returned: "Returned",
      approved: "Approved",
      rejected: "Rejected",
      waiting_payment: "Waiting Payment",
    };
    return map[String(status || "").toLowerCase()] || status;
  };

  const Badge = ({ status }) => <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeClass(status)}`}>{getStatusLabel(status)}</span>;

  const currentDataKey = tabToKey[activeTab];
  const currentTabData = data[currentDataKey] || [];
  const isCurrentTabLoading = loadingDashboard || !!loadingTabs[currentDataKey];

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const match = (item) =>
      Object.values(item).some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(q),
      );
    if (activeTab === "pinjaman") return data.loans.filter((x) => !["returned"].includes(x.status?.toLowerCase())).filter(match);
    if (activeTab === "anggota") return data.members.filter(match);
    if (activeTab === "pengembalian") return data.returns.filter(match);
    if (activeTab === "ajukan")
      return data.loanRequests
        .filter((x) => !["approved", "rejected"].includes(x.status?.toLowerCase()))
        .map((x) => ({ ...x, _type: "loan_request" }))
        .filter(match);
    if (activeTab === "perpanjangan")
      return data.extensionRequests
        .filter((x) => !["approved", "rejected"].includes(x.status?.toLowerCase()))
        .map((x) => ({ ...x, _type: "extension_request" }))
        .filter(match);
    if (activeTab === "buku") {
      return data.books.filter(match);
    }
    if (activeTab === "pesanan") {
      let orders = data.orders;
      if (orderStatusFilter !== "all") orders = orders.filter((x) => x.order_status?.toLowerCase() === orderStatusFilter);
      return orders.filter(match);
    }
    return [];
  }, [activeTab, data, query, orderStatusFilter]);

  const getId = (row) => row.loan_id || row.id;

  const fmtDate = (d, time = false) => (d ? new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", ...(time ? { hour: "2-digit", minute: "2-digit" } : {}) }) : "-");

  const columnsByTab = {
    buku: [
      {
        key: "no",
        label: "No",
        render: (_, index) => index + 1,
      },
      { key: "title", label: "Title" },
      { key: "author", label: "Author" },
      { key: "category", label: "Category" },
      { key: "stock", label: "Stock" },
      {
        key: "price",
        label: "Price",
        render: (row) => (row.price ? `Rp ${Number(row.price).toLocaleString("id-ID")}` : "-"),
      },
    ],
    pinjaman: [
      { key: "member_code", label: "ID" },
      { key: "member_name", label: "Member" },
      { key: "book_title", label: "Book" },
      { key: "loan_date", label: "Loan Date", render: (r) => fmtDate(r.loan_date, true) },
      { key: "due_date", label: "Due Date", render: (r) => fmtDate(r.due_date) },
      { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
      {
        key: "action",
        label: "Action",
        render: (r) => (
          <button type="button" onClick={() => markAsReturned(getId(r))} className="rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:scale-105 transition-all">
            Complete
          </button>
        ),
      },
    ],
    anggota: [
      { key: "member_code", label: "ID" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "nik", label: "NIK" },
      { key: "phone", label: "Phone" },
    ],
    pengembalian: [
      { key: "member_code", label: "ID" },
      { key: "member_name", label: "Member" },
      { key: "book_title", label: "Book" },
      { key: "return_date", label: "Return Date", render: (r) => fmtDate(r.return_date, true) },
    ],
    ajukan: [
      { key: "member_code", label: "ID" },
      { key: "member_name", label: "Member" },
      { key: "book_title", label: "Book" },
      { key: "request_date", label: "Request Date" },
      { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
      {
        key: "action",
        label: "Action",
        render: (r) => (
          <div className="flex gap-2">
            <button type="button" onClick={() => approveLoanRequest(getId(r))} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors">
              Approve
            </button>
            <button type="button" onClick={() => rejectLoanRequest(getId(r))} className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors">
              Reject
            </button>
          </div>
        ),
      },
    ],
    perpanjangan: [
      { key: "member_code", label: "ID" },
      { key: "member_name", label: "Member" },
      { key: "book_title", label: "Book" },
      { key: "old_due_date", label: "Old Due" },
      { key: "new_due_date", label: "New Due" },
      { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
      {
        key: "action",
        label: "Action",
        render: (r) => (
          <div className="flex gap-2">
            <button type="button" onClick={() => approveExtension(getId(r))} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors">
              Approve
            </button>
            <button type="button" onClick={() => rejectExtension(getId(r))} className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors">
              Reject
            </button>
          </div>
        ),
      },
    ],
    pesanan: [
      { key: "order_id", label: "Order No." },
      { key: "user_id", label: "Buyer" },
      { key: "title", label: "Book" },
      { key: "amount", label: "Total", render: (r) => (r.amount ? `Rp ${Number(r.amount).toLocaleString("id-ID")}` : "-") },
      { key: "created_at", label: "Date", render: (r) => fmtDate(r.created_at) },
      { key: "order_status", label: "Status", render: (r) => <Badge status={r.order_status} /> },
      {
        key: "action",
        label: "Action",
        render: (r) => (
          <button type="button" onClick={() => setSelectedOrder(r)} className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 transition-colors">
            Manage
          </button>
        ),
      },
    ],
  };

  const orderSteps = [
    { key: "waiting_payment", label: "Waiting Payment", desc: "Waiting for payment confirmation", icon: Clock3 },
    { key: "processing", label: "Processing", desc: "Order is being prepared", icon: RefreshCcw },
    { key: "shipping", label: "Shipping", desc: "Package is on the way", icon: Truck },
    { key: "completed", label: "Completed", desc: "Package received successfully", icon: PackageCheck },
  ];

  const getStepIndex = (status) => orderSteps.findIndex((s) => s.key === status?.toLowerCase());

  const OrderModal = ({ order, onClose }) => {
    const currentStep = getStepIndex(order.order_status);
    const nextStatus = currentStep < orderSteps.length - 1 ? orderSteps[currentStep + 1]?.key : null;
    const isCancelled = order.order_status?.toLowerCase() === "cancelled";

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Order Details</h3>
              <p className="text-sm text-slate-500">{order.order_id || `#${order.id}`}</p>
            </div>
            <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Buyer", value: order.user_id },
                { label: "Book", value: order.title },
                { label: "Total", value: order.amount ? `Rp ${Number(order.amount).toLocaleString("id-ID")}` : "-", blue: true },
                { label: "Date", value: fmtDate(order.created_at) },
              ].map((item, i) => (
                <div key={i} className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-400 mb-1">{item.label}</div>
                  <div className={`font-semibold text-sm ${item.blue ? "text-blue-700" : "text-slate-800"}`}>{item.value || "-"}</div>
                </div>
              ))}
              {order.address && (
                <div className="col-span-2 rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-400 mb-1">Shipping Address</div>
                  <div className="font-semibold text-sm text-slate-800">{order.address}</div>
                </div>
              )}
            </div>

            {!isCancelled && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Order Tracking</p>
                <div className="relative">
                  <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-slate-100" />
                  <div className="space-y-3">
                    {orderSteps.map((step, idx) => {
                      const done = idx <= currentStep;
                      const active = idx === currentStep;
                      const StepIcon = step.icon;
                      return (
                        <div key={step.key} className="relative flex items-start gap-3 pl-10">
                          <div
                            className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                            ${done ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-400"}
                            ${active ? "ring-4 ring-blue-100 shadow-md" : ""}`}
                          >
                            {done ? <CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                          </div>
                          <div className={`pt-1 ${done ? "opacity-100" : "opacity-40"}`}>
                            <p className={`text-sm font-semibold ${active ? "text-blue-700" : "text-slate-700"}`}>{step.label}</p>
                            <p className="text-xs text-slate-400">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {isCancelled && <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 font-medium text-center">This order has been cancelled</div>}
          </div>

          <div className="border-t border-slate-100 px-6 py-4 flex gap-2 flex-wrap">
            {nextStatus && !isCancelled && (
              <button
                type="button"
                onClick={() => {
                  updateOrderStatus(order.id, nextStatus);
                  onClose();
                }}
                className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Move to: {orderSteps.find((s) => s.key === nextStatus)?.label}
              </button>
            )}
            {!["completed", "cancelled"].includes(order.order_status?.toLowerCase()) && (
              <button
                type="button"
                onClick={() => {
                  updateOrderStatus(order.id, "cancelled");
                  onClose();
                }}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
              >
                Cancel
              </button>
            )}
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const orderStats = useMemo(
    () => ({
      total: data.orders.length,
      pending: data.orders.filter((o) => o.order_status?.toLowerCase() === "waiting_payment").length,
      processing: data.orders.filter((o) => o.order_status?.toLowerCase() === "processing").length,
      shipping: data.orders.filter((o) => o.order_status?.toLowerCase() === "shipping").length,
      completed: data.orders.filter((o) => o.order_status?.toLowerCase() === "completed").length,
    }),
    [data.orders],
  );

  const activeTabInfo = tabs.find((t) => t.key === activeTab);
  const isTabLoading = !!loadingTabs[tabToKey[activeTab]];

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; }
        body { background: #f4f7fb; }
        .sidebar-item { transition: all .2s ease; }
        .sidebar-item.active { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; box-shadow: 0 8px 20px rgba(37,99,235,.25); }
        .sidebar-item:hover:not(.active) { background: #eff6ff; color: #2563eb; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
        .profile-dropdown { animation: slideDown .15s ease; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .collapse-btn { transition: all .3s cubic-bezier(.4,0,.2,1); }
        .collapse-btn:hover { background: linear-gradient(135deg,#2563eb,#1d4ed8); color: white; transform: scale(1.02); }
      `}</style>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/85 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-5 py-3">
          <button type="button" onClick={() => setSidebarOpen((p) => !p)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition-colors lg:hidden">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <LayoutDashboard className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-black text-slate-800 text-base hidden sm:block tracking-tight">Library Dashboard</span>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search data..."
              className="w-56 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-all"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Profile Avatar */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu((p) => !p)}
              className="w-9 h-9 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-all shadow-md shadow-blue-500/20 ring-2 ring-white"
            >
              {adminInitial}
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                {/* Header gradient */}
                <div className="px-5 py-4 bg-linear-to-br from-blue-600 to-indigo-700">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/30">{adminInitial}</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{adminUser?.name || "Admin"}</p>
                      <p className="text-white/70 text-xs truncate">{adminUser?.email || "-"}</p>
                      <span className="inline-block mt-1 bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">{adminUser?.role || "admin"}</span>
                    </div>
                  </div>
                </div>

                {/* Member code */}
                {adminUser?.member_code && (
                  <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Member Code</p>
                    <p className="text-sm font-semibold text-slate-700">{adminUser.member_code}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* ── SIDEBAR ── */}
        <aside
          className={`${sidebarOpen ? "w-64" : "w-18"} shrink-0 transition-all duration-300 ease-in-out h-[calc(100vh-53px)] sticky top-13.25 border-r border-slate-200/60 bg-white/95 backdrop-blur-xl flex flex-col select-none overflow-hidden`}
        >
          {/* Nav items */}
          <div className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1">
            {sidebarOpen && <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Navigation</p>}

            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                title={!sidebarOpen ? tab.label : undefined}
                className={`sidebar-item w-full flex items-center rounded-2xl px-3 py-2.5 text-sm font-semibold text-left
                  ${activeTab === tab.key ? "active" : "text-slate-600"}
                  ${sidebarOpen ? "gap-3" : "justify-center"}`}
              >
                <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                  <tab.icon size={18} strokeWidth={2} />
                </div>
                {sidebarOpen && <span className="truncate">{tab.label}</span>}
              </button>
            ))}
          </div>

          {/* Bottom: Logout + Collapse */}
          <div className="px-2.5 pb-4 space-y-1.5 border-t border-slate-100 pt-3">
            {/* Logout button */}
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              title={!sidebarOpen ? "Logout" : undefined}
              className={`w-full flex items-center rounded-2xl px-3 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors
                ${sidebarOpen ? "gap-3" : "justify-center"}`}
            >
              <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                <LogOut size={18} strokeWidth={2} />
              </div>
              {sidebarOpen && <span>Logout</span>}
            </button>

            {/* Collapse button — dipercantik */}
            <button
              type="button"
              onClick={() => setSidebarOpen((p) => !p)}
              className={`collapse-btn w-full flex items-center rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-500 border border-slate-200 hover:border-blue-300
                ${sidebarOpen ? "gap-3 justify-between" : "justify-center"}`}
            >
              {sidebarOpen ? (
                <>
                  <div className="flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Collapse</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                </>
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 min-w-0 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">{activeTabInfo?.label}</h1>
            <p className="text-sm text-slate-400 mt-0.5">Manage all library data · Auto-refresh every 60s</p>
          </div>

          {/* Stats cards */}
          {activeTab !== "pesanan" && (
            <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Loans", value: data.summary.total_loans, icon: "📚", color: "blue" },
                { label: "Total Members", value: data.summary.total_members, icon: "👥", color: "indigo" },
                { label: "Returned", value: data.summary.total_returns, icon: "↩️", color: "emerald" },
                { label: "Total Requests", value: data.summary.total_requests, icon: "📋", color: "amber" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl">{stat.icon}</span>
                    <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${statColorMap[stat.color]}`}>Live</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{stat.value ?? 0}</div>
                  <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "pesanan" && (
            <>
              <div className="mb-5 grid gap-3 grid-cols-2 lg:grid-cols-5">
                {[
                  { label: "Total", value: orderStats.total, icon: "🛒", bg: "bg-slate-50", text: "text-slate-700" },
                  { label: "Waiting", value: orderStats.pending, icon: "🕐", bg: "bg-amber-50", text: "text-amber-700" },
                  { label: "Processing", value: orderStats.processing, icon: "⚙️", bg: "bg-blue-50", text: "text-blue-700" },
                  { label: "Shipping", value: orderStats.shipping, icon: "🚚", bg: "bg-indigo-50", text: "text-indigo-700" },
                  { label: "Completed", value: orderStats.completed, icon: "✅", bg: "bg-emerald-50", text: "text-emerald-700" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white bg-white p-4 shadow-sm">
                    <div className={`inline-flex w-9 h-9 rounded-xl ${stat.bg} text-lg items-center justify-center mb-2`}>{stat.icon}</div>
                    <div className={`text-xl font-black ${stat.text}`}>{stat.value}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {[{ key: "all", label: "All" }, ...ORDER_STATUSES].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setOrderStatusFilter(s.key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${orderStatusFilter === s.key ? "bg-slate-800 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Mobile search */}
          <div className="mb-4 sm:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search data..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          {activeTab === "buku" && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Add New Book</h2>
              <button type="button" onClick={() => navigate("/admin/books/manage")} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                + Add Book
              </button>
            </div>
          )}

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <div className="max-h-[60vh] overflow-y-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {columnsByTab[activeTab].map((col) => (
                        <th key={col.key} className="sticky top-0 z-10 bg-slate-50 px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {isCurrentTabLoading && filtered.length === 0 ? (
                      <tr>
                        <td colSpan={columnsByTab[activeTab].length} className="px-4 py-16 text-center">
                          <div className="inline-flex flex-col items-center gap-3 text-slate-400">
                            <div className="w-7 h-7 rounded-full border-3 border-blue-500 border-t-transparent animate-spin" />
                            <span className="text-sm">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={columnsByTab[activeTab].length} className="px-4 py-16 text-center text-slate-400 text-sm">
                          No data found.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((row) => (
                        <tr key={row.loan_id || row.id || Math.random()} className="hover:bg-slate-50/60 transition-colors">
                          {columnsByTab[activeTab].map((col) => (
                            <td key={col.key} className="px-4 py-3.5 text-slate-700">
                              {col.render ? col.render(row) : (row[col.key] ?? "-")}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {!isCurrentTabLoading && filtered.length > 0 && <div className="px-4 py-2.5 border-t border-slate-50 text-xs text-slate-400 text-right">{filtered.length} records</div>}
          </div>
        </main>
      </div>

      {/* Order Modal */}
      {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 text-center">
            <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Konfirmasi Logout</h3>
            <p className="text-sm text-slate-500 mb-5">Yakin ingin keluar dari dashboard admin?</p>
            <div className="flex gap-2.5">
              <button type="button" onClick={() => setShowLogoutConfirm(false)} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Batal
              </button>
              <button type="button" onClick={handleLogout} className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

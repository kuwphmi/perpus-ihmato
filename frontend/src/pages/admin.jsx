import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  RotateCcw,
  ClipboardList,
  RefreshCcw,
  ShoppingCart,
  Search,
  Printer,
  ChevronLeft,
  ChevronRight,
  Menu,
  CheckCircle2,
  Clock3,
  Truck,
  PackageCheck,
  LibraryBig,
  LogOut,
  AlertCircle,
  TrendingUp,
  UserCheck,
  RotateCw,
  ClipboardCheck,
} from "lucide-react";
import printReceipt from "../utils/printReceipt";

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
  {
    key: "waiting_payment",
    label: "Waiting Payment",
    color: "amber",
  },

  {
    key: "processing",
    label: "Processing",
    color: "blue",
  },

  {
    key: "shipping",
    label: "Shipping",
    color: "indigo",
  },

  {
    key: "completed",
    label: "Completed",
    color: "emerald",
  },

  {
    key: "cancelled",
    label: "Cancelled",
    color: "rose",
  },
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

const CACHE_TTL = 30_000;
const cacheStore = {
  dashboard: { expires: 0, value: null },
  tabs: {},
};

const getCachedDashboard = () => {
  if (Date.now() < cacheStore.dashboard.expires) {
    return cacheStore.dashboard.value;
  }
  return null;
};

const setCachedDashboard = (value) => {
  cacheStore.dashboard.value = value;
  cacheStore.dashboard.expires = Date.now() + CACHE_TTL;
};

const getCachedTab = (key) => {
  const entry = cacheStore.tabs[key];
  if (entry && Date.now() < entry.expires) {
    return entry.value;
  }
  return null;
};

const setCachedTab = (key, value) => {
  cacheStore.tabs[key] = {
    value,
    expires: Date.now() + CACHE_TTL,
  };
};

export default function AdminPerpustakaan() {
  const [activeTab, setActiveTab] = useState("pinjaman");
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingTabs, setLoadingTabs] = useState({});
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [selectedMonth] = useState(getCurrentMonth());
  const [selectedYear] = useState(getCurrentYear());
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const profileMenuRef = useRef(null);
  const [adminName, setAdminName] = useState("A");
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

  const navigate = useNavigate();

  // Get admin name from localStorage on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.name) {
      setAdminName(user.name.charAt(0).toUpperCase());
    }
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [profileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setProfileMenuOpen(false);
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

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
      throw new Error(text || "Request failed");
    }

    return res.json();
  };

  const loadDashboard = useCallback(async () => {
    setLoadingDashboard(true);
    try {
      const cachedDashboard = getCachedDashboard();
      if (cachedDashboard) {
        setData((prev) => ({
          ...prev,
          summary: {
            ...cachedDashboard,
            total_orders: cachedDashboard.total_orders || 0,
            pending_orders: cachedDashboard.pending_orders || 0,
          },
        }));
        return cachedDashboard;
      }

      const dashboard = await fetchJson(`${API_BASE}/admin/dashboard`);
      setCachedDashboard(dashboard);
      setData((prev) => ({
        ...prev,
        summary: {
          ...dashboard,
          total_orders: dashboard.total_orders || 0,
          pending_orders: dashboard.pending_orders || 0,
        },
      }));
      return dashboard;
    } catch (err) {
      console.error(err);
      alert("Failed to fetch dashboard data.");
      return null;
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  const loadTabData = useCallback(async (tabKey) => {
    const dataKey = tabToKey[tabKey];
    if (!dataKey) return;

    const cachedTab = getCachedTab(dataKey);
    if (cachedTab) {
      setData((prev) => ({
        ...prev,
        [dataKey]: Array.isArray(cachedTab) ? cachedTab : [],
      }));
      setLoadedTabs((prev) => ({ ...prev, [dataKey]: true }));
      return cachedTab;
    }

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

      setCachedTab(dataKey, Array.isArray(result) ? result : []);
      setData((prev) => ({
        ...prev,
        [dataKey]: Array.isArray(result) ? result : [],
      }));
      setLoadedTabs((prev) => ({ ...prev, [dataKey]: true }));
      return result;
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tab data.");
      return null;
    } finally {
      setLoadingTabs((prev) => ({ ...prev, [dataKey]: false }));
    }
  }, []);

  const refreshCurrentView = useCallback(async () => {
    await Promise.all([loadDashboard(), loadTabData(activeTab)]);
  }, [activeTab, loadDashboard, loadTabData]);

  useEffect(() => {
    refreshCurrentView();

    const interval = setInterval(() => {
      refreshCurrentView();
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [activeTab, refreshCurrentView]);

  const rejectLoanRequest = async (id) => {
    try {
      await fetchJson(`${API_BASE}/admin/loan-requests/${id}/reject`, {
        method: "POST",
      });
      await refreshCurrentView();
    } catch {
      alert("Failed to reject request.");
    }
  };

  const rejectExtension = async (id) => {
    try {
      await fetchJson(`${API_BASE}/admin/extension-requests/${id}/reject`, {
        method: "POST",
      });
      await refreshCurrentView();
    } catch {
      alert("Failed to reject extension.");
    }
  };

  const approveLoanRequest = async (id) => {
    try {
      await fetchJson(`${API_BASE}/admin/loan-requests/${id}/approve`, {
        method: "POST",
      });
      await refreshCurrentView();
    } catch {
      alert("Failed to approve request.");
    }
  };

  const markAsReturned = async (id) => {
    try {
      await fetchJson(`${API_BASE}/admin/loans/${id}/return`, {
        method: "POST",
      });
      await refreshCurrentView();
    } catch {
      alert("Failed to update return.");
    }
  };

  const approveExtension = async (id) => {
    try {
      await fetchJson(`${API_BASE}/admin/extension-requests/${id}/approve`, {
        method: "POST",
      });
      await refreshCurrentView();
    } catch {
      alert("Failed to approve extension.");
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await fetchJson(`${API_BASE}/admin/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({
          order_status: status,
        }),
      });

      await refreshCurrentView();

      if (selectedOrder?.id === id) {
        setSelectedOrder((prev) => ({
          ...prev,
          order_status: status,
        }));
      }
    } catch {
      alert("Failed to update order status.");
    }
  };

  const handlePrint = () => {
    const url = `${API_BASE}/admin/report/monthly/pdf?month=${selectedMonth}&year=${selectedYear}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const badgeClass = (status) => {
    const s = String(status || "").toLowerCase();

    if (s.includes("approved") || s.includes("selesai") || s.includes("returned") || s.includes("completed")) return "bg-emerald-100 text-emerald-700 border-emerald-200";

    if (s.includes("pending") || s.includes("menunggu")) return "bg-amber-100 text-amber-700 border-amber-200";

    if (s.includes("rejected") || s.includes("ditolak") || s.includes("cancelled")) return "bg-rose-100 text-rose-700 border-rose-200";

    if (s.includes("processing") || s.includes("diproses")) return "bg-blue-100 text-blue-700 border-blue-200";

    if (s.includes("shipping") || s.includes("dikirim")) return "bg-indigo-100 text-indigo-700 border-indigo-200";

    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getStatusLabel = (status) => {
    const s = String(status || "").toLowerCase();
    const map = {
      pending: "Pending",
      processing: "Processing",
      shipping: "Shipping",
      completed: "Completed",
      cancelled: "Cancelled",
      returned: "Returned",
      approved: "Approved",
      rejected: "Rejected",
    };
    return map[s] || status;
  };

  const Badge = ({ status }) => <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeClass(status)}`}>{getStatusLabel(status)}</span>;

  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    const match = (item) =>
      Object.values(item).some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(q),
      );

    if (activeTab === "pinjaman") return data.loans.filter((x) => !["returned", "selesai"].includes(x.status?.toLowerCase())).filter(match);

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
      if (orderStatusFilter !== "all") {
        orders = orders.filter((x) => x.order_status?.toLowerCase() === orderStatusFilter);
      }
      return orders.filter(match);
    }

    return [];
  }, [activeTab, data, query, orderStatusFilter]);

  const getId = (row) => row.loan_id || row.id;

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

      {
        key: "loan_date",
        label: "Loan Date",

        render: (row) =>
          row.loan_date
            ? new Date(row.loan_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-",
      },

      {
        key: "due_date",
        label: "Due Date",

        render: (row) =>
          row.due_date
            ? new Date(row.due_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-",
      },

      {
        key: "status",
        label: "Status",

        render: (row) => <Badge status={row.status} />,
      },

      {
        key: "action",
        label: "Action",

        render: (row) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => markAsReturned(getId(row))}
              className="
      rounded-xl
      bg-linear-to-r
      from-blue-600
      to-indigo-600
      px-3
      py-1.5
      text-xs
      font-semibold
      text-white
      shadow-lg
      hover:scale-[1.02]
      transition-all
    "
            >
              Complete
            </button>

            <button
              type="button"
              onClick={() => printReceipt(row)}
              className="
      rounded-xl
      bg-emerald-600
      hover:bg-emerald-700
      px-3
      py-1.5
      text-xs
      font-semibold
      text-white
      transition-all
    "
            >
              Print
            </button>
          </div>
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
      {
        key: "return_date",
        label: "Return Date",

        render: (row) =>
          row.return_date
            ? new Date(row.return_date).toLocaleString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-",
      },
    ],

    ajukan: [
      { key: "member_code", label: "ID" },
      { key: "member_name", label: "Member" },
      { key: "book_title", label: "Book" },
      { key: "request_date", label: "Request Date" },
      {
        key: "status",
        label: "Status",
        render: (row) => <Badge status={row.status} />,
      },
      {
        key: "action",
        label: "Action",
        render: (row) => (
          <div className="flex items-center gap-2">
            {/* APPROVE BUTTON */}
            <button type="button" onClick={() => approveLoanRequest(getId(row))} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors">
              Approve
            </button>

            {/* REJECT BUTTON */}
            <button type="button" onClick={() => rejectLoanRequest(getId(row))} className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors">
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
      { key: "old_due_date", label: "Old Due Date" },
      { key: "new_due_date", label: "New Due Date" },
      {
        key: "status",
        label: "Status",
        render: (row) => <Badge status={row.status} />,
      },
      {
        key: "action",
        label: "Action",
        render: (row) => (
          <div className="flex items-center gap-2">
            {/* APPROVE BUTTON */}
            <button type="button" onClick={() => approveExtension(getId(row))} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors">
              Approve
            </button>

            {/* REJECT BUTTON */}
            <button type="button" onClick={() => rejectExtension(getId(row))} className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors">
              Reject
            </button>
          </div>
        ),
      },
    ],

    pesanan: [
      {
        key: "order_id",
        label: "Order No.",
      },

      {
        key: "user_id",
        label: "Buyer",
      },

      {
        key: "title",
        label: "Book",
      },

      {
        key: "amount",
        label: "Total",

        render: (row) => (row.amount ? `Rp ${Number(row.amount).toLocaleString("id-ID")}` : "-"),
      },

      {
        key: "created_at",
        label: "Date",
      },

      {
        key: "status",
        label: "Status",

        render: (row) => <Badge status={row.order_status} />,
      },

      {
        key: "action",
        label: "Action",

        render: (row) => (
          <button type="button" onClick={() => setSelectedOrder(row)} className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 transition-colors">
            Manage
          </button>
        ),
      },
    ],
  };

  const orderSteps = [
    {
      key: "waiting_payment",
      label: "Waiting Payment",
      desc: "Waiting for payment",
      icon: Clock3,
    },

    {
      key: "processing",
      label: "Processing",
      desc: "Order is being processed",
      icon: RefreshCcw,
    },

    {
      key: "shipping",
      label: "Shipping",
      desc: "Package is on delivery",
      icon: Truck,
    },

    {
      key: "completed",
      label: "Completed",
      desc: "Package received successfully",
      icon: PackageCheck,
    },
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
            <button type="button" onClick={onClose} className="rounded-full w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              ✕
            </button>
          </div>

          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-xs text-slate-400 mb-1">Buyer</div>
                <div className="font-semibold text-slate-800">{order.user_id || "-"}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-xs text-slate-400 mb-1">Book</div>
                <div className="font-semibold text-slate-800">{order.title || "-"}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-xs text-slate-400 mb-1">Total</div>
                <div className="font-bold text-blue-700">{order.amount ? `Rp ${Number(order.amount).toLocaleString("id-ID")}` : "-"}</div>{" "}
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-xs text-slate-400 mb-1">Date</div>
                <div className="font-semibold text-slate-800">{order.created_at || "-"}</div>
              </div>
              {order.address && (
                <div className="col-span-2 rounded-lg bg-slate-50 p-3">
                  <div className="text-xs text-slate-400 mb-1">Shipping Address</div>
                  <div className="font-semibold text-slate-800">{order.address}</div>
                </div>
              )}
            </div>

            {!isCancelled && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Order Tracking</div>
                <div className="relative">
                  <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-slate-200"></div>
                  <div className="space-y-3">
                    {orderSteps.map((step, idx) => {
                      const done = idx <= currentStep;
                      const active = idx === currentStep;
                      const StepIcon = step.icon;

                      return (
                        <div key={step.key} className="relative flex items-start gap-3 pl-10">
                          <div
                            className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                              done ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-300 text-slate-400"
                            } ${active ? "ring-4 ring-blue-100" : ""}`}
                          >
                            {done ? <CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                          </div>
                          <div className={`pt-0.5 ${done ? "opacity-100" : "opacity-40"}`}>
                            <div className={`text-sm font-semibold ${active ? "text-blue-700" : "text-slate-700"}`}>{step.label}</div>
                            <div className="text-xs text-slate-400">{step.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {isCancelled && <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 font-medium text-center">This order has been cancelled</div>}
          </div>

          <div className="border-t border-slate-100 px-6 py-4 flex gap-3 flex-wrap">
            {nextStatus && !isCancelled && (
              <button
                type="button"
                onClick={() => {
                  updateOrderStatus(order.id, nextStatus);
                  onClose();
                }}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
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

  const orderStats = useMemo(() => {
    const orders = data.orders;
    return {
      total: orders.length,
      pending: orders.filter((o) => o.order_status?.toLowerCase() === "waiting_payment").length,
      processing: orders.filter((o) => o.order_status?.toLowerCase() === "processing").length,
      shipping: orders.filter((o) => o.order_status?.toLowerCase() === "shipping").length,
      completed: orders.filter((o) => o.order_status?.toLowerCase() === "completed").length,
    };
  }, [data.orders]);

  const activeTabInfo = tabs.find((t) => t.key === activeTab);
  const currentLoadingKey = tabToKey[activeTab];
  const isTabLoading = !!loadingTabs[currentLoadingKey];

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * {
          font-family: 'Inter', sans-serif;
        }

        body {
          background: #f4f7fb;
        }

        .sidebar-item {
          transition: all .2s ease;
          position: relative;
        }

        .sidebar-item.active {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          box-shadow: 0 10px 25px rgba(37,99,235,.18);
        }

        .sidebar-item:hover:not(.active) {
          background: #eff6ff;
          color: #2563eb;
        }

        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }
      `}</style>

      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center gap-4 px-6 py-3">
          <button type="button" onClick={() => setSidebarOpen((p) => !p)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition-colors lg:hidden">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-slate-800 text-lg hidden sm:block">Library Dashboard</span>
          </div>

          <div className="flex-1" />

          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search data..."
              className="w-64 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>

          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="w-10 h-10 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 ring-2 ring-white hover:shadow-xl transition-all cursor-pointer"
            >
              {adminName}
            </button>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">Admin Profile</p>
                </div>

                <button type="button" onClick={confirmLogout} className="w-full px-4 py-3 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`${sidebarOpen ? "w-72" : "w-20"} shrink-0 transition-all duration-300 h-[calc(100vh-53px)] sticky top-13.25 overflow-hidden border-r border-slate-200/70 bg-white/90 backdrop-blur-xl flex flex-col select-none`}>
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Navigation</div>

            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`sidebar-item w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold mb-2 text-left ${activeTab === tab.key ? "active" : "text-slate-600"} ${!sidebarOpen ? "justify-center px-0" : ""}`}
                title={tab.label}
              >
                <div className="shrink-0">
                  <tab.icon size={18} strokeWidth={2.2} />
                </div>

                <span className={`truncate transition-all duration-300 ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 p-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((p) => !p)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 px-3 py-2.5 text-xs font-semibold text-blue-600 hover:from-blue-100 hover:to-indigo-100 transition-all shadow-sm"
            >
              {sidebarOpen ? (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4" />
                  Expand
                </>
              )}
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">{activeTabInfo?.label}</h1>
            <p className="text-sm text-slate-500 mt-1">Manage all library data with a modern dashboard.</p>
          </div>

          {activeTab !== "pesanan" && (
            <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Loans", value: data.summary.total_loans, Icon: TrendingUp, color: "blue" },
                { label: "Total Members", value: data.summary.total_members, Icon: UserCheck, color: "indigo" },
                { label: "Returned", value: data.summary.total_returns, Icon: RotateCw, color: "emerald" },
                { label: "Total Requests", value: data.summary.total_requests, Icon: ClipboardCheck, color: "amber" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-5 shadow-lg shadow-slate-200/40 hover:-translate-y-1 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color === "blue" ? "bg-blue-50 text-blue-600" : stat.color === "indigo" ? "bg-indigo-50 text-indigo-600" : stat.color === "emerald" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                    >
                      <stat.Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${statColorMap[stat.color]}`}>Data</span>
                  </div>
                  <div className="text-3xl font-black text-slate-900">{stat.value ?? 0}</div>
                  <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "pesanan" && (
            <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-5">
              {[
                { label: "Total Orders", value: orderStats.total, Icon: ShoppingCart, bg: "bg-slate-100", text: "text-slate-700", iconColor: "text-slate-600" },
                { label: "Pending", value: orderStats.pending, Icon: Clock3, bg: "bg-amber-50", text: "text-amber-700", iconColor: "text-amber-600" },
                { label: "Processing", value: orderStats.processing, Icon: RefreshCcw, bg: "bg-blue-50", text: "text-blue-700", iconColor: "text-blue-600" },
                { label: "Shipping", value: orderStats.shipping, Icon: Truck, bg: "bg-indigo-50", text: "text-indigo-700", iconColor: "text-indigo-600" },
                { label: "Completed", value: orderStats.completed, Icon: CheckCircle2, bg: "bg-emerald-50", text: "text-emerald-700", iconColor: "text-emerald-600" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-4 shadow-lg shadow-slate-200/40">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.bg} ${stat.iconColor} mb-2`}>
                    <stat.Icon className="w-5 h-5" />
                  </div>
                  <div className={`text-2xl font-black ${stat.text}`}>{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "pesanan" && (
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOrderStatusFilter("all")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${orderStatusFilter === "all" ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                All
              </button>
              {ORDER_STATUSES.map((s) => (
                <button
                  type="button"
                  key={s.key}
                  onClick={() => setOrderStatusFilter(s.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${orderStatusFilter === s.key ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div className="mb-4 sm:hidden">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search data..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          {activeTab === "buku" && (
            <div className="mb-6">
              {/* HEADER */}
              <h2 className="text-xl font-bold mb-3">Add New Book</h2>

              {/* BUTTON ADD BOOK */}
              <button onClick={() => navigate("/admin/books/manage")} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition">
                + Add Book
              </button>
            </div>
          )}

          <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/40">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {columnsByTab[activeTab].map((col) => (
                      <th key={col.key} className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loadingDashboard || isTabLoading ? (
                    <tr>
                      <td colSpan={columnsByTab[activeTab].length} className="px-4 py-16 text-center">
                        <div className="inline-flex flex-col items-center gap-3 text-slate-400">
                          <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                          <span className="text-sm font-medium">Loading data...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={columnsByTab[activeTab].length} className="px-4 py-16 text-center text-slate-400">
                        No data found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row, index) => (
                      <tr key={row.loan_id || row.id || Math.random()} className="hover:bg-slate-50/70 transition-colors">
                        {columnsByTab[activeTab].map((col) => (
                          <td key={col.key} className="px-4 py-4 text-slate-700">
                            {col.render ? col.render(row, index) : (row[col.key] ?? "-")}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {!loadingDashboard && !isTabLoading && filtered.length > 0 && <div className="mt-3 text-xs text-slate-400 text-right">Showing {filtered.length} data</div>}
        </main>
      </div>

      {/* ═══════════ LOGOUT CONFIRMATION MODAL ═══════════ */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm mx-4 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>

            <h3 className="text-center text-lg font-black text-gray-800 mb-2">Confirm Logout</h3>

            <p className="text-center text-gray-600 text-sm mb-6">Are you sure you want to logout? You will need to login again to access the library dashboard.</p>

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowLogoutConfirm(false)} className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                Cancel
              </button>

              <button type="button" onClick={handleLogout} className="flex-1 px-4 py-3 rounded-2xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
}

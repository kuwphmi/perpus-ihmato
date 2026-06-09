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

const getCurrentMonth = () => String(new Date().getMonth() + 1);
const getCurrentYear = () => String(new Date().getFullYear());
const getTabKey = (tab, bookView) => {
  if (tab === "buku") {
    return bookView === "loan" ? "borrowBooks" : "shopBooks";
  }

  return {
    pinjaman: "loans",
    anggota: "members",
    pengembalian: "returns",
    ajukan: "loanRequests",
    perpanjangan: "extensionRequests",
    pesanan: "orders",
  }[tab];
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
  const coverInputRef = useRef(null); // Ref untuk mereset input file
  const [adminName, setAdminName] = useState("A");
  const [loadedTabs, setLoadedTabs] = useState({
    borrowBooks: false,
    shopBooks: false,
    loans: false,
    members: false,
    returns: false,
    loanRequests: false,
    extensionRequests: false,
    orders: false,
  });

  const [bookView, setBookView] = useState("loan");

  const [borrowForm, setBorrowForm] = useState({
    title: "",
    author: "",
    category: "",
    stock: "",
    description: "",
    cover: "", // Akan disi file objek
  });

  const [shopForm, setShopForm] = useState({
    title: "",
    author: "",
    category: "",
    stock: "",
    price: "",
    description: "",
    cover: "", // Akan disi file objek
  });

  const [data, setData] = useState({
    borrowBooks: [],
    shopBooks: [],
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.name) {
      setAdminName(user.name.charAt(0).toUpperCase());
    }
  }, []);

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
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser?.id) {
      const key = `chatHistory_${storedUser.id}`;
      const archiveKey = `chatArchive_${storedUser.id}`;
      const history = localStorage.getItem(key);
      if (history) {
        localStorage.setItem(archiveKey, history);
        localStorage.removeItem(key);
      }
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setProfileMenuOpen(false);
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  // Diperbarui untuk mendukung FormData (upload file)
  const fetchJson = async (url, options = {}) => {
    const isFormData = options.body instanceof FormData;
    const headers = {
      Accept: "application/json",
      ...(options.headers || {}),
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Request failed");
    }

    return res.json();
  };

  const addBorrowBook = async () => {
    try {
      const formData = new FormData();
      Object.keys(borrowForm).forEach((key) => formData.append(key, borrowForm[key]));

      await fetchJson(`${API_BASE}/admin/borrow-books`, {
        method: "POST",
        body: formData,
      });
      alert("Borrow book added successfully");
      loadTabData("buku", true);
      setBorrowForm({ title: "", author: "", category: "", stock: "", description: "", cover: "" });
      if (coverInputRef.current) coverInputRef.current.value = ""; // Reset file input
    } catch {
      alert("Failed to add borrow book");
    }
  };

  const addShopBook = async () => {
    try {
      const formData = new FormData();
      Object.keys(shopForm).forEach((key) => formData.append(key, shopForm[key]));

      await fetchJson(`${API_BASE}/admin/books`, {
        method: "POST",
        body: formData,
      });
      alert("Shop book added successfully");
      loadTabData("buku", true);
      setShopForm({ title: "", author: "", category: "", stock: "", price: "", description: "", cover: "" });
      if (coverInputRef.current) coverInputRef.current.value = ""; // Reset file input
    } catch {
      alert("Failed to add shop book");
    }
  };

  const loadDashboard = useCallback(async (force = false) => {
    setLoadingDashboard(true);
    try {
      const cachedDashboard = getCachedDashboard();
      if (!force && cachedDashboard) {
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
      return null;
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  const loadTabData = useCallback(
    async (tabKey, force = false) => {
      const dataKey = getTabKey(tabKey, bookView);
      if (!dataKey) return;

      setLoadingTabs((prev) => ({
        ...prev,
        [dataKey]: true,
      }));

      const cachedTab = getCachedTab(dataKey);
      if (!force && cachedTab) {
        setData((prev) => ({
          ...prev,
          [dataKey]: Array.isArray(cachedTab) ? cachedTab : [],
        }));
        setLoadedTabs((prev) => ({ ...prev, [dataKey]: true }));
        setLoadingTabs((prev) => ({ ...prev, [dataKey]: false }));
        return cachedTab;
      }

      try {
        let result = [];
        switch (tabKey) {
          case "buku":
            result = bookView === "loan" ? await fetchJson(`${API_BASE}/admin/borrow-books`) : await fetchJson(`${API_BASE}/admin/books`);
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

        setData((prev) => ({
          ...prev,
          [dataKey]: Array.isArray(result) ? result : [],
        }));
        setCachedTab(dataKey, result);
        setLoadedTabs((prev) => ({ ...prev, [dataKey]: true }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTabs((prev) => ({
          ...prev,
          [dataKey]: false,
        }));
      }
    },
    [bookView],
  );

  const refreshCurrentView = useCallback(
    async (force = false) => {
      Promise.all([loadDashboard(force), loadTabData(activeTab, force)]);
    },
    [activeTab, loadDashboard, loadTabData],
  );

  useEffect(() => {
    refreshCurrentView();
    const interval = setInterval(() => {
      refreshCurrentView();
    }, 60000);
    return () => clearInterval(interval);
  }, [activeTab, bookView, refreshCurrentView]);

  const getId = (row) => row.loan_id || row.id;

  const rejectLoanRequest = async (id) => {
    setData((prev) => ({ ...prev, loanRequests: prev.loanRequests.map((req) => (getId(req) === id ? { ...req, status: "rejected" } : req)) }));
    try {
      await fetchJson(`${API_BASE}/admin/loan-requests/${id}/reject`, { method: "POST" });
      refreshCurrentView(true);
    } catch {
      alert("Failed to reject request.");
      refreshCurrentView(true);
    }
  };

  const approveLoanRequest = async (id) => {
    setData((prev) => ({ ...prev, loanRequests: prev.loanRequests.map((req) => (getId(req) === id ? { ...req, status: "approved" } : req)) }));
    try {
      await fetchJson(`${API_BASE}/admin/loan-requests/${id}/approve`, { method: "POST" });
      refreshCurrentView(true);
    } catch {
      alert("Failed to approve request.");
      refreshCurrentView(true);
    }
  };

  const rejectExtension = async (id) => {
    setData((prev) => ({ ...prev, extensionRequests: prev.extensionRequests.map((req) => (getId(req) === id ? { ...req, status: "rejected" } : req)) }));
    try {
      await fetchJson(`${API_BASE}/admin/extension-requests/${id}/reject`, { method: "POST" });
      refreshCurrentView(true);
    } catch {
      alert("Failed to reject extension.");
      refreshCurrentView(true);
    }
  };

  const approveExtension = async (id) => {
    setData((prev) => ({ ...prev, extensionRequests: prev.extensionRequests.map((req) => (getId(req) === id ? { ...req, status: "approved" } : req)) }));
    try {
      await fetchJson(`${API_BASE}/admin/extension-requests/${id}/approve`, { method: "POST" });
      refreshCurrentView(true);
    } catch {
      alert("Failed to approve extension.");
      refreshCurrentView(true);
    }
  };

  const markAsReturned = async (id) => {
    setData((prev) => ({ ...prev, loans: prev.loans.map((loan) => (getId(loan) === id ? { ...loan, status: "returned" } : loan)) }));
    try {
      await fetchJson(`${API_BASE}/admin/loans/${id}/return`, { method: "POST" });
      refreshCurrentView(true);
    } catch {
      alert("Failed to update return.");
      refreshCurrentView(true);
    }
  };

  const updateOrderStatus = async (id, status) => {
    setSelectedOrder((prev) => ({ ...prev, order_status: status }));
    setData((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === id ? { ...o, order_status: status } : o)),
    }));
    try {
      await fetchJson(`${API_BASE}/admin/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ order_status: status }),
      });
      refreshCurrentView(true);
    } catch {
      alert("Failed to update order status.");
      refreshCurrentView(true);
    }
  };

  const handlePrint = () => {
    const url = `${API_BASE}/admin/report/monthly/pdf?month=${selectedMonth}&year=${selectedYear}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const badgeClass = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("approved") || s.includes("finished") || s.includes("returned") || s.includes("completed")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (s.includes("pending") || s.includes("waiting")) return "bg-amber-100 text-amber-700 border-amber-200";
    if (s.includes("rejected") || s.includes("denied") || s.includes("cancelled")) return "bg-rose-100 text-rose-700 border-rose-200";
    if (s.includes("processing") || s.includes("processed")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (s.includes("shipping") || s.includes("shipped")) return "bg-indigo-100 text-indigo-700 border-indigo-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getStatusLabel = (status, deliveryType) => {
    const s = String(status || "").toLowerCase();
    if (deliveryType === "pickup") {
      const pickupMap = {
        waiting_payment: "Waiting Payment",
        processing: "Processing",
        ready_pickup: "Ready Pickup",
        completed: "Picked Up",
        cancelled: "Cancelled",
      };
      return pickupMap[s] || status;
    }
    const deliveryMap = {
      waiting_payment: "Waiting Payment",
      processing: "Processing",
      shipping: "Shipping",
      completed: "Completed",
      cancelled: "Cancelled",
      returned: "Returned",
      approved: "Approved",
      rejected: "Rejected",
    };
    return deliveryMap[s] || status;
  };

  const Badge = ({ status, deliveryType }) => <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeClass(status)}`}>{getStatusLabel(status, deliveryType)}</span>;

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

    if (activeTab === "ajukan") {
      return data.loanRequests
        .filter((x) => !["approved", "rejected"].includes(x.status?.toLowerCase()))
        .map((x) => ({ ...x, _type: "loan_request" }))
        .filter(match);
    }

    if (activeTab === "perpanjangan") {
      return data.extensionRequests
        .filter((x) => !["approved", "rejected"].includes(x.status?.toLowerCase()))
        .map((x) => ({ ...x, _type: "extension_request" }))
        .filter(match);
    }

    if (activeTab === "buku") {
      const books = bookView === "loan" ? data.borrowBooks : data.shopBooks;
      return books.filter(match);
    }

    if (activeTab === "pesanan") {
      let orders = data.orders;
      if (orderStatusFilter !== "all") {
        orders = orders.filter((x) => x.order_status?.toLowerCase() === orderStatusFilter);
      }
      return orders.filter(match);
    }

    return [];
  }, [activeTab, data, query, orderStatusFilter, bookView]);

  const columnsByTab = useMemo(
    () => ({
      buku:
        bookView === "loan"
          ? [
              { key: "no", label: "No", render: (_, index) => index + 1 },
              { key: "title", label: "Title" },
              { key: "author", label: "Author" },
              { key: "category", label: "Category" },
              { key: "stock", label: "Stock" },
              {
                key: "type",
                label: "Type",
                render: () => <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Loan Book</span>,
              },
            ]
          : [
              { key: "no", label: "No", render: (_, index) => index + 1 },
              { key: "title", label: "Title" },
              { key: "author", label: "Author" },
              { key: "category", label: "Category" },
              { key: "stock", label: "Stock" },
              {
                key: "price",
                label: "Price",
                render: (row) => `Rp ${Number(row.price || 0).toLocaleString("id-ID")}`,
              },
              {
                key: "type",
                label: "Type",
                render: () => <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Shop Book</span>,
              },
            ],

      pinjaman: [
        { key: "member_code", label: "ID" },
        { key: "member_name", label: "Member" },
        { key: "book_title", label: "Book" },
        {
          key: "loan_date",
          label: "Loan Date",
          render: (row) => (row.loan_date ? new Date(row.loan_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"),
        },
        {
          key: "due_date",
          label: "Due Date",
          render: (row) => (row.due_date ? new Date(row.due_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"),
        },
        { key: "status", label: "Status", render: (row) => <Badge status={row.status} /> },
        {
          key: "action",
          label: "Action",
          render: (row) => (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => markAsReturned(getId(row))} className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all">
                Complete
              </button>
              <button type="button" onClick={() => printReceipt(row)} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 active:scale-95 transition-all">
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
          render: (row) => (row.return_date ? new Date(row.return_date).toLocaleString("en-GB", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"),
        },
      ],

      ajukan: [
        { key: "member_code", label: "ID" },
        { key: "member_name", label: "Member" },
        { key: "book_title", label: "Book" },
        {
          key: "request_date",
          label: "Request Date",
          render: (row) => (row.request_date ? new Date(row.request_date).toLocaleDateString("en-GB") : "-"),
        },
        { key: "status", label: "Status", render: (row) => <Badge status={row.status} /> },
        {
          key: "action",
          label: "Action",
          render: (row) => (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => approveLoanRequest(getId(row))} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 active:scale-95 transition-all">
                Approve
              </button>
              <button type="button" onClick={() => rejectLoanRequest(getId(row))} className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 active:scale-95 transition-all">
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
        { key: "status", label: "Status", render: (row) => <Badge status={row.status} /> },
        {
          key: "action",
          label: "Action",
          render: (row) => (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => approveExtension(getId(row))} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 active:scale-95 transition-all">
                Approve
              </button>
              <button type="button" onClick={() => rejectExtension(getId(row))} className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 active:scale-95 transition-all">
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
        {
          key: "amount",
          label: "Total",
          render: (row) => (row.amount ? `Rp ${Number(row.amount).toLocaleString("id-ID")}` : "-"),
        },
        { key: "created_at", label: "Date" },
        { key: "status", label: "Status", render: (row) => <Badge status={row.order_status} deliveryType={row.delivery_type} /> },
        {
          key: "action",
          label: "Action",
          render: (row) => (
            <button type="button" onClick={() => setSelectedOrder(row)} className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 active:scale-95 transition-all">
              Manage
            </button>
          ),
        },
      ],
    }),
    [bookView],
  );

const getOrderSteps = (type) => {
  if (type === "pickup") {
    return [
      {
        key: "waiting_payment",
        label: "Waiting Payment",
        desc: "Waiting for customer payment",
        icon: Clock3,
      },
      {
        key: "processing",
        label: "Processing",
        desc: "Order is being prepared",
        icon: RefreshCcw,
      },
      {
        key: "ready_pickup",
        label: "Ready Pickup",
        desc: "Ready to be collected",
        icon: PackageCheck,
      },
      {
        key: "completed",
        label: "Completed",
        desc: "Order finished",
        icon: CheckCircle2,
      },
    ];
  }

  return [
    {
      key: "waiting_payment",
      label: "Waiting Payment",
      desc: "Waiting for payment confirmation",
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
      desc: "Order is on the way",
      icon: Truck,
    },
    {
      key: "completed",
      label: "Completed",
      desc: "Order delivered",
      icon: PackageCheck,
    },
  ];
};

const OrderModal = ({ order, onClose }) => {
  const orderSteps = getOrderSteps(order.delivery_type);

  const currentIndex = orderSteps.findIndex(
    (s) => s.key === order.order_status?.toLowerCase()
  );

  const nextStatus =
    currentIndex < orderSteps.length - 1
      ? orderSteps[currentIndex + 1]?.key
      : null;

  const isCancelled =
    order.order_status?.toLowerCase() === "cancelled";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h3 className="font-bold text-lg">Order Details</h3>
            <p className="text-sm text-slate-500">
              {order.order_id || `#${order.id}`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-4 space-y-4">

          {/* INFO */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-400">Buyer</p>
              <p className="font-semibold">{order.user_id || "-"}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-400">Book</p>
              <p className="font-semibold">{order.title || "-"}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-400">Total</p>
              <p className="font-bold text-blue-600">
                {order.amount
                  ? `Rp ${Number(order.amount).toLocaleString("id-ID")}`
                  : "-"}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-400">Date</p>
              <p className="font-semibold">
                {order.created_at || "-"}
              </p>
            </div>
          </div>

          {/* TRACKING */}
          {!isCancelled && (
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">
                Order Tracking
              </h4>

              <div className="relative">
                <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-slate-200" />

                <div className="space-y-4">
                  {orderSteps.map((step, idx) => {
                    const done = idx <= currentIndex;
                    const active = idx === currentIndex;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className="relative flex items-start gap-3 pl-10"
                      >
                        <div
                          className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border ${
                            done
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-slate-400 border-slate-300"
                          }`}
                        >
                          {done ? (
                            "✔"
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>

                        <div className={done ? "" : "opacity-40"}>
                          <p
                            className={`text-sm font-semibold ${
                              active ? "text-blue-600" : "text-slate-700"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-xs text-slate-400">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm font-medium text-center">
              Order cancelled
            </div>
          )}
        </div>

        {/* FOOTER ACTION */}
        <div className="border-t px-6 py-4 flex gap-2">

          {nextStatus && !isCancelled && (
            <button
              onClick={() =>
                updateOrderStatus(order.id, nextStatus)
              }
              className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold"
            >
              Next:{" "}
              {orderSteps.find(
                (s) => s.key === nextStatus
              )?.label}
            </button>
          )}

          {!["completed", "cancelled"].includes(
            order.order_status?.toLowerCase()
          ) && (
            <button
              onClick={() =>
                updateOrderStatus(order.id, "cancelled")
              }
              className="px-4 py-2 rounded-xl border text-rose-600 border-rose-200"
            >
              Cancel
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans">
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 bg-white border-r border-slate-200 flex flex-col z-20`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          {sidebarOpen && <span className="font-bold text-xl text-blue-600 tracking-tight">BookIn Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors mx-auto">
            <Menu size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive ? "bg-blue-50 text-blue-700 font-semibold shadow-sm" : "text-slate-600 hover:bg-slate-100"} ${!sidebarOpen && "justify-center"}`}
                title={!sidebarOpen ? tab.label : undefined}
              >
                <Icon size={20} className={isActive ? "text-blue-600" : "text-slate-400"} />
                {sidebarOpen && <span className="truncate">{tab.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search records..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => refreshCurrentView(true)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2" title="Refresh Data">
              <RefreshCcw size={18} className={loadingDashboard ? "animate-spin" : ""} />
            </button>
            <button onClick={handlePrint} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Print Monthly Report">
              <Printer size={18} />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <div className="relative" ref={profileMenuRef}>
              <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm ring-2 ring-white">
                {adminName}
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50 py-1">
                  <button onClick={confirmLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-50/50 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Loans</p>
                <h4 className="text-2xl font-bold text-slate-900">{data.summary.total_loans || 0}</h4>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-600">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Members</p>
                <h4 className="text-2xl font-bold text-slate-900">{data.summary.total_members || 0}</h4>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-50 text-indigo-600">
                <RotateCcw size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Returns</p>
                <h4 className="text-2xl font-bold text-slate-900">{data.summary.total_returns || 0}</h4>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-50 text-amber-600">
                <ShoppingCart size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Pending Orders</p>
                <h4 className="text-2xl font-bold text-slate-900">{data.summary.pending_orders || 0}</h4>
              </div>
            </div>
          </div>

          {activeTab === "buku" && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Manage Books</h2>

              {/* SWITCH TAB */}
              <div className="flex gap-3 mb-4">
                <button onClick={() => setBookView("loan")} className={`px-4 py-2 rounded-xl font-semibold ${bookView === "loan" ? "bg-blue-600 text-white" : "bg-white border"}`}>
                  Borrow Books
                </button>

                <button onClick={() => setBookView("shop")} className={`px-4 py-2 rounded-xl font-semibold ${bookView === "shop" ? "bg-emerald-600 text-white" : "bg-white border"}`}>
                  Shop Books
                </button>
              </div>

              {/* ADD BUTTON */}
              {bookView === "loan" ? (
                <button onClick={() => navigate("/admin/books/borrow/add")} className="bg-blue-600 text-white px-4 py-2 rounded-xl">
                  + Add Borrow Book
                </button>
              ) : (
                <button onClick={() => navigate("/admin/books/shop/add")} className="bg-emerald-600 text-white px-4 py-2 rounded-xl">
                  + Add Shop Book
                </button>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto min-h-100">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {columnsByTab[activeTab]?.map((col, i) => (
                      <th key={i} className="px-6 py-4 font-semibold text-slate-700 whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length > 0 ? (
                    filtered.map((row, rowIndex) => (
                      <tr key={getId(row) || rowIndex} className="hover:bg-slate-50/80 transition-colors group">
                        {columnsByTab[activeTab]?.map((col, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 text-slate-600">
                            {col.render ? col.render(row, rowIndex) : row[col.key] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columnsByTab[activeTab]?.length || 1} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                          <ClipboardCheck className="w-10 h-10 text-slate-300" />
                          <p className="text-base font-medium">No records found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500 flex justify-between items-center">
              <span>Showing {filtered.length} entries</span>
            </div>
          </div>
        </div>
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center space-y-6">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <LogOut size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Logout</h3>
              <p className="text-slate-500 text-sm px-4">Are you sure you want to log out?</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleLogout} className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors">
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

         {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

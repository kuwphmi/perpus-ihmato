import supabase from "../src/config/supabase.js";

/* ================= DASHBOARD ================= */
export const getDashboard = async (req, res) => {
  try {
    const { count: totalLoans } = await supabase
      .from("loans")
      .select("*", { count: "exact", head: true })
      .eq("status", "borrowed");

    const { count: totalMembers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: totalReturns } = await supabase
      .from("loans")
      .select("*", { count: "exact", head: true })
      .eq("status", "returned");

    const { count: totalRequests } = await supabase
      .from("loans")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    res.json({
      total_loans: totalLoans || 0,
      total_members: totalMembers || 0,
      total_returns: totalReturns || 0,
      total_requests: totalRequests || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= LOANS ================= */
export const getLoans = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("loans")
      .select("id, title, loan_date, due_date, status, users(name)")
      .eq("status", "borrowed");

    if (error) throw error;

    res.json(
      data.map((item) => ({
        id: item.id,
        member_name: item.users?.name,
        book_title: item.title,
        loan_date: item.loan_date,
        due_date: item.due_date,
        status: item.status,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= LOAN REQUEST ================= */
export const getLoanRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("loans")
      .select("id, title, loan_date, status, users(name)")
      .eq("status", "pending");

    if (error) throw error;

    res.json(
      data.map((item) => ({
        id: item.id,
        member_name: item.users?.name,
        book_title: item.title,
        request_date: item.loan_date,
        status: item.status,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= APPROVE ================= */
export const approveLoanRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("loans")
      .update({
        status: "borrowed",
        loan_date: new Date(),
        due_date: new Date(Date.now() + 7 * 86400000),
      })
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= REJECT ================= */
export const rejectLoanRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("loans")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= RETURN ================= */
export const markAsReturned = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("loans")
      .update({
        status: "returned",
        return_date: new Date(),
      })
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Returned" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= MEMBERS ================= */
export const getMembers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email");

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= RETURNS ================= */
export const getReturns = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("loans")
      .select("id, title, return_date, users(name)")
      .eq("status", "returned");

    if (error) throw error;

    res.json(
      data.map((item) => ({
        id: item.id,
        member_name: item.users?.name,
        book_title: item.title,
        return_date: item.return_date,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= EXTENSIONS ================= */
export const getExtensions = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("extensions")
      .select(`
        id,
        new_due_date,
        status,
        loans(title, due_date, users(name))
      `);

    if (error) throw error;

    res.json(
      data.map((item) => ({
        id: item.id,
        member_name: item.loans?.users?.name,
        book_title: item.loans?.title,
        old_due_date: item.loans?.due_date,
        new_due_date: item.new_due_date,
        status: item.status,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= APPROVE EXTENSION ================= */
export const approveExtension = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: ext } = await supabase
      .from("extensions")
      .select("*")
      .eq("id", id)
      .single();

    await supabase
      .from("loans")
      .update({
        due_date: new Date(Date.now() + 7 * 86400000),
      })
      .eq("id", ext.loan_id);

    await supabase
      .from("extensions")
      .update({ status: "approved" })
      .eq("id", id);

    res.json({ message: "Extension approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= REJECT EXTENSION ================= */
export const rejectExtension = async (req, res) => {
  const { id } = req.params;

  try {
    await supabase
      .from("extensions")
      .update({ status: "rejected" })
      .eq("id", id);

    res.json({ message: "Rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
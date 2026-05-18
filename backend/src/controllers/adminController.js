import supabase from "../config/supabase.js";

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

/* ================= MANAGE BOOKS ================= */

/* GET ALL BOOKS */
export const getBooks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("books") // sesuaikan nama tabel kamu (bisa "books" kalau beda)
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ADD BOOK */
export const addBooks = async (req, res) => {
  try {
    const {
      title,
      author,
      cover,
      stock,
      category,
      price,
      description,
    } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        status: false,
        message: "Title dan author wajib diisi",
      });
    }

    const { data, error } = await supabase
      .from("books")
      .insert([
        {
          title,
          author,
          cover,
          stock: stock || 0,
          category: category || "Umum",
          price: price || 0,
          description: description || "",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.json({
      status: true,
      message: "Buku berhasil ditambahkan",
      data,
    });

  } catch (err) {

  console.error("ADD BOOK ERROR:", err);

  res.status(500).json({
    status: false,
    message: err.message,
    full_error: err,
  });
  }
};

/* ================= LOANS ================= */
export const getLoans = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("loans")
      .select(`
        id,
        title,
        loan_date,
        due_date,
        status,
        users(name, member_code)
      `)
      .eq("status", "borrowed");

    if (error) throw error;

    res.json(
      data.map((item) => ({
        id: item.id,
        member_code: item.users?.member_code || "-",
        member_name: item.users?.name || "-",
        book_title: item.title,
        loan_date: item.loan_date,
        due_date: item.due_date,
        status: item.status,
      }))
    );

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ================= LOAN REQUEST ================= */
export const getLoanRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("loan_requests")
      .select(`
        id,
        book_title,
        request_date,
        status,
        users(name, member_code)
      `)
      .eq("status", "pending");

    if (error) throw error;

    res.json(
      data.map((item) => ({
        id: item.id,
        member_code: item.users?.member_code || "-",
        member_name: item.users?.name || "-",
        book_title: item.book_title || "-",
        request_date: item.request_date,
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

    // ambil request
    const { data: requestData, error: requestError } = await supabase
      .from("loan_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (requestError) throw requestError;

    // insert ke loans
    const { error: loanError } = await supabase
      .from("loans")
      .insert([
        {
          user_id: requestData.user_id,
          book_key: requestData.book_key,
          title: requestData.book_title,
          author: requestData.author,
          cover: requestData.cover,
          loan_date: new Date(),
          due_date: new Date(Date.now() + 7 * 86400000),
          status: "borrowed",
        },
      ]);

    if (loanError) throw loanError;

    // update request
    await supabase
      .from("loan_requests")
      .update({
        status: "approved",
      })
      .eq("id", id);

    res.json({
      message: "Loan approved successfully",
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
};


/* ================= REJECT ================= */
export const rejectLoanRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("loan_requests")
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

    // ambil loan
    const { data: loan, error: loanError } = await supabase
      .from("loans")
      .select("*")
      .eq("id", id)
      .single();

    if (loanError) throw loanError;

    // ambil user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, member_code, name")
      .eq("id", loan.user_id)
      .single();

    if (userError) throw userError;

    // simpan ke returns
    const { error: returnError } = await supabase
      .from("returns")
      .insert([
        {
          loan_id: loan.id,
          user_id: user.id,

          member_code: user.member_code,
          member_name: user.name,

          book_key: loan.book_key,
          book_title: loan.title,
          author: loan.author,
          cover: loan.cover,

          return_date: new Date(),

          fine: 0,
        },
      ]);

    if (returnError) throw returnError;

    // update loans
    const { error: updateError } = await supabase
      .from("loans")
      .update({
        status: "returned",
        return_date: new Date(),
      })
      .eq("id", id);

    if (updateError) throw updateError;

    res.json({
      message: "Book returned successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message,
    });

  }
};

/* ================= MEMBERS ================= */
export const getMembers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        member_code,
        name,
        email,
        nik,
        phone
      `);

    if (error) throw error;

    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ================= RETURNS ================= */
export const getReturns = async (req, res) => {
  try {
    // ambil data loans returned
    const { data: loans, error: loanError } = await supabase
      .from("loans")
      .select("*")
      .eq("status", "returned");

    if (loanError) throw loanError;

    // ambil semua users
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("id, member_code, name");

    if (userError) throw userError;

    // gabungkan manual
    const formatted = loans.map((loan) => {
      const user = users.find(
  (u) => String(u.id) === String(loan.user_id)
);

      return {
        member_code: user?.member_code || "-",
        member_name: user?.name || "-",
        book_title: loan.title || "-",
        return_date: loan.return_date || "-",
        fine: "-",
      };
    });

    res.json(formatted);

  } catch (err) {
    console.error("GET RETURNS ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
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
        loans( 
          title,
          due_date,
          users(name, member_code)
        )
      `);

    if (error) throw error;

    res.json(
      data.map((item) => ({
        id: item.id,
        member_name: item.loans?.users?.name,
        member_code: item.loans?.users?.member_code,
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
import supabase from "../config/supabase.js";

/* ================= DASHBOARD ================= */
export const getDashboard = async (req, res) => {
  try {
    const [loanCount, memberCount, returnCount, requestCount, orderCount] = await Promise.all([
      supabase
        .from("loans")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("status", "borrowed"),
      supabase
        .from("users")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("role", "user"),
      supabase
        .from("loans")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("status", "returned"),
      supabase
        .from("loan_requests")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("status", "pending"),
      supabase.from("payments").select("*", {
        count: "exact",
        head: true,
      }),
    ]);

    const totalLoans = loanCount.count;
    const totalMembers = memberCount.count;
    const totalReturns = returnCount.count;
    const totalRequests = requestCount.count;
    const totalOrders = orderCount.count;

    res.json({
      total_loans: totalLoans || 0,
      total_members: totalMembers || 0,
      total_returns: totalReturns || 0,
      total_requests: totalRequests || 0,
      total_orders: totalOrders || 0,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= BORROW BOOKS =================
export const getBorrowBooks = async (req, res) => {
  try {

    const { data, error } = await supabase
      .from("borrow_books")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch borrow books",
    });
  }
};

// ================= ADD BORROW BOOK =================
export const addBorrowBook = async (req, res) => {
  try {

    const {
      title,
      author,
      category,
      stock,
      description,
      cover,
    } = req.body;

    const { data, error } = await supabase
      .from("borrow_books")
      .insert([
        {
          title,
          author,
          category,
          stock,
          description,
          cover,
        },
      ])
      .select();

    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to add borrow book",
    });
  }
};

// ================= IMPORT BORROW BOOKS =================
export const importBorrowBooks = async (req, res) => {
  try {
    const books = req.body.books;

    if (!books || books.length === 0) {
      return res.status(400).json({
        message: "No books found",
      });
    }

    const { data, error } = await supabase
      .from("borrow_books")
      .insert(books)
      .select();

    if (error) throw error;

    res.json({
      status: true,
      message: `${books.length} books imported successfully`,
      data,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

/* ================= UPDATE BORROW BOOK ================= */

export const updateBorrowBook = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      author,
      category,
      stock,
      description,
      cover,
    } = req.body;

    const { data, error } = await supabase
      .from("borrow_books")
      .update({
        title,
        author,
        category,
        stock,
        description,
        cover,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      status: true,
      message: "Borrow book updated",
      data,
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

/* ================= DELETE BORROW BOOK ================= */

export const deleteBorrowBook = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("borrow_books")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      status: true,
      message: "Borrow book deleted",
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};


/* ================= SHOP BOOKS ================= */

/* GET ALL SHOP BOOKS */
export const getShopBooks = async (req, res) => {
  try {

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
};

/* ADD SHOP BOOK */
export const addShopBook = async (req, res) => {
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

    const { data, error } = await supabase
      .from("books")
      .insert([
        {
          title,
          author,
          cover,
          stock,
          category,
          price,
          description,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.json({
      status: true,
      message: "Shop book added",
      data,
    });
  } catch (err) {


    console.error(err);

    res.status(500).json({
      status: false,
      message: err.message,
    });

  }
};

export const importShopBooks = async (req, res) => {
  try {

    const { books } = req.body;

    if (!books || books.length === 0) {
      return res.status(400).json({
        message: "No books found",
      });
    }

    const { data, error } = await supabase
      .from("books")
      .insert(books)
      .select();

    if (error) throw error;

    res.json({
      message: `${books.length} books imported successfully`,
      data,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
    });

  }
};

/* UPDATE SHOP BOOK */
export const updateShopBook = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      title,
      author,
      cover,
      stock,
      category,
      price,
      description,
    } = req.body;

    const { data, error } = await supabase
      .from("books")
      .update({
        title,
        author,
        cover,
        stock,
        category,
        price,
        description,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      status: true,
      message: "Shop book updated",
      data,
    });

  } catch (err) {

    res.status(500).json({
      status: false,
      message: err.message,
    });

  }
};

/* DELETE SHOP BOOK */
export const deleteShopBook = async (req, res) => {
  try {

    const { id } = req.params;

    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      status: true,
      message: "Shop book deleted",
    });

  } catch (err) {

    console.error("ADD BOOK ERROR:", err);

    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};



/* ================= LOANS ================= */
export const getLoans = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("loans")
      .select(
        `
  id,
  title,
  receipt_code,
  loan_date,
  due_date,
  status,
  users(name, member_code)
`,
      )
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
        receipt_code: item.receipt_code,
      })),
    );
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ================= LOAN REQUEST ================= */
export const getLoanRequests =
  async (req, res) => {
    try {

     const { data, error } =
      await supabase
        .from("loan_requests")
        .select(`
          id,
          book_title,
          request_date,
          status,
          user_id,
          users(name, member_code)
        `)
        .eq("status", "pending");

      console.log(data);
    if (error) throw error;

    res.json(
      data.map((item) => ({
        id: item.id,

        receipt_code: item.receipt_code,
        member_code: item.users?.member_code || "-",
        member_name: item.users?.name || "-",
        book_title: item.book_title || "-",
        request_date: item.request_date,
        status: item.status,
      })),
    );
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ================= APPROVE ================= */
export const approveLoanRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: requestData, error: requestError } = await supabase.from("loan_requests").select("*").eq("id", id).single();

    if (requestError) throw requestError;
    const receiptCode = `BK-${Date.now()}`;

    const { error: loanError } = await supabase.from("loans").insert([
      {
        user_id: requestData.user_id,

        book_key: requestData.book_key,

        title: requestData.book_title,

        author: requestData.author,

        cover: requestData.cover,

        loan_date: new Date(),

        due_date: new Date(Date.now() + 7 * 86400000),

        status: "borrowed",
        receipt_code: receiptCode,
      },
    ]);

    if (loanError) throw loanError;

    await supabase
      .from("loan_requests")
      .update({
        status: "approved",
      })
      .eq("id", id);

    // NOTIFICATION
    await supabase.from("notifications").insert([
      {
        user_id: requestData.user_id,

        type: "borrow",

        title: "Borrow Approved",

        message: `Your request for "${requestData.book_title}" has been approved.`,
      },
    ]);

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
    const { data: requestData } = await supabase.from("loan_requests").select("*").eq("id", id).single();

    const { error } = await supabase
      .from("loan_requests")
      .update({
        status: "rejected",
      })
      .eq("id", id);

    if (error) throw error;

    // NOTIFICATION
    await supabase.from("notifications").insert([
      {
        user_id: requestData.user_id,

        type: "borrow",

        title: "Borrow Rejected",

        message: `Your request for "${requestData.book_title}" was rejected.`,
      },
    ]);

    res.json({
      message: "Rejected",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ================= RETURN ================= */
export const markAsReturned = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: loan, error: loanError } = await supabase.from("loans").select("*").eq("id", id).single();

    if (loanError) throw loanError;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select(
        `
          id,
          member_code,
          name
        `,
      )
      .eq("id", loan.user_id)
      .single();

    if (userError) throw userError;

    const { error: returnError } = await supabase.from("returns").insert([
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

    const { error: updateError } = await supabase
      .from("loans")
      .update({
        status: "returned",
        return_date: new Date(),
      })
      .eq("id", id);

    if (updateError) throw updateError;

    // NOTIFICATION
    await supabase.from("notifications").insert([
      {
        user_id: user.id,

        type: "return",

        title: "Book Returned",

        message: `Thanks for returning "${loan.title}". Enjoy your next reading adventure ✨`,
      },
    ]);

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
      .select(
        `
        id,
        member_code,
        name,
        email,
        nik,
        phone
      `,
      )
      .eq("role", "user");

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
    const { data, error } = await supabase
      .from("returns")
      .select(
        `
            member_code,
            member_name,
            book_title,
            return_date,
            fine
          `,
      )
      .order("return_date", {
        ascending: false,
      });

    if (error) throw error;

    res.json(data);
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
    const { data, error } = await supabase.from("extensions").select(`
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
        member_code: item.loans?.users?.member_code || "-",
        member_name: item.loans?.users?.name || "-",
        book_title: item.loans?.title || "-",
        old_due_date: item.loans?.due_date || "-",   
        new_due_date: item.new_due_date || "-",
        status: item.status,
      }))
    );
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ================= APPROVE EXTENSION ================= */
export const approveExtension = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: ext } = await supabase.from("extensions").select("*").eq("id", id).single();

    await supabase
      .from("loans")
      .update({
        due_date: new Date(Date.now() + 7 * 86400000),
      })
      .eq("id", ext.loan_id);

    await supabase
      .from("extensions")
      .update({
        status: "approved",
      })
      .eq("id", id);


      await supabase
        .from("loans")
        .update({
          due_date: new Date(new Date(ext.old_due_date).getTime() + 7 * 86400000),
        })
        .eq("id", ext.loan_id);

    await supabase.from("notifications").insert([
      {
        user_id: ext.user_id,
        type: "extension",
        title: "Extension Approved",
        message: "Your borrowing extension has been approved.",
      },
    ]);
    res.json({
      message: "Extension approved",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ================= REJECT EXTENSION ================= */
export const rejectExtension = async (req, res) => {
  const { id } = req.params;

  try {
    await supabase
      .from("extensions")
      .update({
        status: "rejected",
      })
      .eq("id", id);

    const { data: ext } = await supabase.from("extensions").select("*").eq("id", id).single();

    await supabase.from("notifications").insert([
      {
        user_id: ext.user_id,

        type: "extension",

        title: "Extension Rejected",

        message: "Your borrowing extension was rejected.",
      },
    ]);
    res.json({
      message: "Rejected",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ================= ORDERS ================= */

// GET ALL ORDERS
export const getOrders = async (req, res) => {
  try {
    // PAYMENTS
    const { data: payments, error } = await supabase.from("payments").select("*").order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    // ADDRESSES
    const { data: addresses } = await supabase.from("addresses").select("*");

    // JOIN MANUAL
    const formatted = payments.map((item) => {
      const address = addresses.find((a) => String(a.id) === String(item.address_id));

      return {
        ...item,

        receiver_name: address?.receiver_name || "-",

        phone: address?.phone || "-",

        full_address: address?.full_address || "-",

        district: address?.district || "-",

        postal_code: address?.postal_code || "-",
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ================= UPDATE ORDER STATUS ================= */
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;

  const { order_status } = req.body;

  try {
    const { error } = await supabase
      .from("payments")
      .update({
        order_status,
      })
      .eq("id", id);

    if (error) throw error;

    // GET PAYMENT
    const { data: payment } = await supabase.from("payments").select("*").eq("id", id).single();

    // NOTIFICATION
    await supabase.from("notifications").insert([
      {
        user_id: payment.user_id,

        type: "order",

        title: "Order Update",

        message:
          order_status === "processing"
            ? "Your order is being processed."
            : order_status === "shipping"
              ? "Your order is on delivery."
              : order_status === "completed"
                ? "Your order has arrived successfully."
                : `Order status updated to ${order_status}`,
      },
    ]);

    res.json({
      message: "Order updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* ================= COURIER ORDERS ================= */
export const getCourierOrders = async (req, res) => {
  try {
    const { data: payments, error } = await supabase
      .from("payments")
      .select("*")
      .in("order_status", ["processing", "shipping", "completed"])
      .order("created_at", { ascending: false });

    if (error) throw error;

    const { data: addresses } = await supabase
      .from("addresses")
      .select("*");

    const result = payments.map((item) => {
      const address = addresses.find(
        (a) => String(a.id) === String(item.address_id)
      );

      return {
        ...item,
        address,
      };
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
import supabase from "../config/supabase.js";

export const createLoanRequest = async (req, res) => {
  try {
    const {
      user_id,
      title,
      author,
      cover,
      book_key,
      category,
    } = req.body;

    // cek pinjaman aktif
    const { data: existingLoans, error: checkError } = await supabase
      .from("loan_requests")
      .select("*")
      .eq("user_id", user_id)
      .in("status", ["pending", "approved"]);

    if (checkError) throw checkError;

    // limit 2 buku
    if (existingLoans.length >= 2) {
      return res.json({
        status: false,
        message: "Borrow limit reached",
      });
    }

    // cek buku yang sama
    const { data: sameBook } = await supabase
      .from("loan_requests")
      .select("*")
      .eq("user_id", user_id)
      .eq("book_key", book_key)
      .in("status", ["pending", "approved", "borrowed"]);

    if (sameBookError) throw sameBookError;

    if (sameBook.length > 0) {
      return res.json({
        status: false,
        message: "You already requested this book",
      });
    }

    // ✅ INSERT REQUEST (ini yang hilang di flow kamu)
    const { data, error } = await supabase
      .from("loan_requests")
      .insert([
        {
          user_id,
          title,
          author,
          cover,
          book_key,
          category,
          status: "pending",
        },
      ])
      .select();

    if (error) throw error;

    return res.json({
      status: true,
      message: "Borrow request submitted",
      data,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
export const approveLoan = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    // ambil request
    const {
      data: requestData,
      error: requestError,
    } = await supabase
      .from("loan_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (
      requestError ||
      !requestData
    ) {

      return res.status(404).json({
        status: false,
        message:
          "Request not found",
      });

    }

    // generate receipt
    const receiptCode =
      `BK-${Date.now()}`;

    console.log(
      "RECEIPT CODE:",
      receiptCode
    );

    console.log(
      "REQUEST DATA:",
      requestData
    );

    // due date 14 hari
    const dueDate =
      new Date();

    dueDate.setDate(
      dueDate.getDate() + 14
    );

    // insert ke loans
    const {
      data: loanData,
      error: loanError,
    } = await supabase
      .from("loans")
      .insert([
        {
          user_id: requestData.user_id,
          title: requestData.title,
          author: requestData.author,
          cover: requestData.cover,
          book_key: requestData.book_key,
          category: requestData.category,
          loan_date: new Date(),
          due_date: dueDate,
          status: "borrowed",
          receipt_code: receiptCode,
        },
      ])
      .select();

    console.log(
      "LOAN DATA:",
      loanData
    );

    console.log(
      "LOAN ERROR:",
      loanError
    );

    if (loanError)
      throw loanError;

    // update request
    await supabase
      .from("loan_requests")
      .update({
        status:
          "approved",
      })
      .eq("id", id);

    res.json({
      status: true,
      message:
        "Loan approved",
      loanData,
    });

  } catch (err) {

    console.log(
      "APPROVE ERROR:",
      err
    );

    res.status(500).json({
      status: false,
      message:
        err.message,
    });

  }

};

export const checkBorrowLimit =
  async (req, res) => {

    try {

      const { user_id } =
        req.params;

      const {
        data,
        error,
      } = await supabase
        .from("loan_requests")
        .select("*")
        .eq(
          "user_id",
          user_id
        )
        .in("status", [
          "pending",
          "approved",
        ]);

      if (error)
        throw error;

      res.json({
        total:
          data.length,

        canBorrow:
          data.length < 2,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          err.message,
      });

    }
  };

export const checkDueReminders = async () => {

  try {

    const tomorrow = new Date();

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    const tomorrowStr =
      tomorrow.toISOString().split("T")[0];

    const { data: loans, error } =
      await supabase
        .from("loans")
        .select("*")
        .eq("status", "borrowed");

    if (error) throw error;

    for (const loan of loans) {

      const dueDate =
        new Date(loan.due_date)
          .toISOString()
          .split("T")[0];

      if (dueDate === tomorrowStr) {

        await supabase
          .from("notifications")
          .insert([
            {
              user_id: loan.user_id,
              title: "Book Return Reminder",

              message:
                `The due date for "${loan.title}" is tomorrow. Please return the book on time to avoid late fees.`,
              is_read: false,
            },
          ]);

      }

    }

  } catch (err) {

    console.log(err);

  }

};

export const checkLateLoans = async () => {
  try {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStr = today.toISOString().split("T")[0];

    const { data: loans, error } = await supabase
      .from("loans")
      .select("*")
      .eq("status", "borrowed");

    if (error) throw error;

    for (const loan of loans) {

      const dueDate = new Date(loan.due_date);
      dueDate.setHours(0, 0, 0, 0);

      if (today <= dueDate) continue;

      // cek apakah notif hari ini sudah pernah dibuat
      const { data: existingNotif } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", loan.user_id)
        .eq("title", "Overdue Book")
        .gte("created_at", `${todayStr}T00:00:00`);

      if (existingNotif?.length > 0) {
        continue;
      }

      const diffTime = today - dueDate;

      const lateDays = Math.ceil(
        diffTime / (1000 * 60 * 60 * 24)
      );

      const fine = lateDays * 1000;

      await supabase
        .from("notifications")
        .insert([
          {
            user_id: loan.user_id,
            title: "Overdue Book",
            message: `"${loan.title}" is overdue by ${lateDays} day(s). Current late fee: Rp${fine}.`,
            is_read: false,
          },
        ]);
    }

  }
  catch (err) {
    console.log(err);
  }
};
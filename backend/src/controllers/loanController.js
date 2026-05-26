import supabase from "../config/supabase.js";

export const createLoanRequest = async (
  req,
  res
) => {

  try {

    const {
      user_id,
      title,
      author,
      cover,
      book_key,
    } = req.body;

    // cek pinjaman aktif
    const {
      data: existingLoans,
      error: checkError,
    } = await supabase
      .from("loan_requests")
      .select("*")
      .eq("user_id", user_id)
      .in("status", [
        "pending",
        "approved",
      ]);

    if (checkError)
      throw checkError;

    // maksimal 2 buku
    if (
      existingLoans.length >= 2
    ) {

      return res.json({
        status: false,
        message:
          "Borrow limit reached",
      });

    }

    // insert request
    const {
      data,
      error,
    } = await supabase
      .from("loan_requests")
      .insert([
        {
          user_id,
          title,
          author,
          cover,
          book_key,
          status:
            "pending",
        },
      ])
      .select();

    if (error)
      throw error;

    res.json({
      status: true,
      message:
        "Borrow request submitted",
      data,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      status: false,
      message:
        error.message,
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

    // due date 7 hari
    const dueDate =
      new Date();

    dueDate.setDate(
      dueDate.getDate() + 7
    );

    // insert ke loans
    const {
      data: loanData,
      error: loanError,
    } = await supabase
      .from("loans")
      .insert([
        {
          user_id:
            requestData.user_id,

          title:
            requestData.title,

          author:
            requestData.author,

          cover:
            requestData.cover,

          book_key:
            requestData.book_key,

          loan_date:
            new Date(),

          due_date:
            dueDate,

          status:
            "borrowed",

          receipt_code:
            receiptCode,
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
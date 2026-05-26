const printReceipt = (
  loan
) => {

  const printWindow =
    window.open(
      "",
      "_blank"
    );

 printWindow.document.write(`
<html>

<head>
  <title>BukuIn Receipt</title>

  <style>
    *{
      margin:0;
      padding:0;
      box-sizing:border-box;
    }

    body{
      font-family:Arial,sans-serif;
      background:#f4f7fb;
      padding:40px;
      color:#111827;
    }

    .receipt{
      max-width:420px;
      margin:auto;
      background:white;
      border-radius:28px;
      overflow:hidden;
      box-shadow:0 10px 40px rgba(0,0,0,0.08);
    }

    .header{
      background:linear-gradient(
        135deg,
        #2563eb,
        #1d4ed8
      );

      color:white;
      padding:32px 28px;
      text-align:center;
    }

    .header h1{
      font-size:28px;
      letter-spacing:2px;
      margin-bottom:6px;
    }

    .header p{
      opacity:.9;
      font-size:13px;
    }

    .content{
      padding:28px;
    }

    .row{
      display:flex;
      justify-content:space-between;
      gap:20px;
      margin-bottom:18px;
      padding-bottom:14px;
      border-bottom:1px dashed #d1d5db;
    }

    .label{
      font-size:12px;
      color:#6b7280;
      text-transform:uppercase;
      letter-spacing:.5px;
    }

    .value{
      font-size:14px;
      font-weight:600;
      text-align:right;
      color:#111827;
    }

    .status{
      display:inline-block;
      padding:8px 14px;
      border-radius:999px;
      font-size:12px;
      font-weight:700;
      background:#dbeafe;
      color:#1d4ed8;
      text-transform:uppercase;
    }

    .footer{
      text-align:center;
      padding:24px;
      font-size:12px;
      color:#9ca3af;
    }

    .barcode{
      margin-top:18px;
      font-size:24px;
      letter-spacing:4px;
      color:#111827;
    }

    @media print{
      body{
        background:white;
        padding:0;
      }

      .receipt{
        box-shadow:none;
      }
    }
  </style>
</head>

<body>

  <div class="receipt">

    <div class="header">
      <h1>BOOKIN</h1>
      <p>Digital Library Receipt</p>
    </div>

    <div class="content">

      <div class="row">
        <div class="label">
          Receipt Code
        </div>

        <div class="value">
          ${loan.receipt_code || "-"}
        </div>
      </div>

      <div class="row">
        <div class="label">
          Member
        </div>

        <div class="value">
          ${loan.member_name || loan.name || "-"}
        </div>
      </div>

      <div class="row">
        <div class="label">
          Book
        </div>

        <div class="value">
          ${loan.book_title || loan.title || "-"}
        </div>
      </div>

      <div class="row">
        <div class="label">
          Borrow Date
        </div>

        <div class="value">
          ${
            loan.loan_date
              ? new Date(
                  loan.loan_date
                ).toLocaleDateString("id-ID")
              : "-"
          }
        </div>
      </div>

      <div class="row">
        <div class="label">
          Due Date
        </div>

        <div class="value">
          ${
            loan.due_date
              ? new Date(
                  loan.due_date
                ).toLocaleDateString("id-ID")
              : "-"
          }
        </div>
      </div>

      <div class="row" style="border:none;margin-bottom:0;">
        <div class="label">
          Status
        </div>

        <div class="value">
          <span class="status">
            ${loan.status || "-"}
          </span>
        </div>
      </div>

      <div class="barcode">
        ||||| || |||||
      </div>

    </div>

    <div class="footer">
      Thank you for using BukuIn ✨
    </div>

  </div>

</body>

</html>
`);

  printWindow.document.close();

  printWindow.print();

};

export default printReceipt;
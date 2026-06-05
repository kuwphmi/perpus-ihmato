const run = async () => {
  const API_BASE = process.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  const res = await fetch(`${API_BASE}/payment/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: 1,
      items: [
        {
          book_key: "buku-1",
          title: "Buku Pemrograman",
          price: 50000,
          qty: 1,
        },
      ],
      customer: {
        first_name: "Budi",
        email: "budi@mail.com",
        phone: "08123456789",
      },
    }),
  });

  const data = await res.json();
  console.log(data);
};

run();

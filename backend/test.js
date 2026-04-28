const run = async () => {
  const res = await fetch("http://localhost:3000/api/payment/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      order_id: "ORDER-" + Date.now(),
      gross_amount: 50000,
      customer: {
        first_name: "Budi",
        email: "budi@mail.com",
        phone: "08123456789"
      }
    })
  });

  const data = await res.json();
  console.log(data);
};

run();


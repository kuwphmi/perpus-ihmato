import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Checkout() {

  const location = useLocation();
  const navigate = useNavigate();

  const items = location.state?.items || [];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notif, setNotif] = useState("");

  const showNotif = (message) => {

    setNotif(message);

    setTimeout(() => {
      setNotif("");
    }, 2000);

  };

  const total = items.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );

  const handlePayment = async () => {

    if (!name || !phone || !address) {

      showNotif("Please complete the form first");
      return;

    }

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      // SAVE ADDRESS
      await axios.post(
        "http://localhost:3000/api/address",
        {
          user_id: user.id,
          receiver_name: name,
          phone,
          province: "-",
          city: "-",
          district: "-",
          postal_code: "-",
          full_address: address,
        }
      );
      const res = await axios.post(
        "http://localhost:3000/api/payment/create",
        {
          user_id: user.id,
          items,
          customer_name: name,
          phone,
          address,
        }
      );

      const token = res.data.token;

      window.snap.pay(token, {

        onSuccess: function () {

          showNotif("Payment successful");

          setTimeout(() => {
            navigate("/trackingbuku");
          }, 1500);

        },

        onPending: function () {

          showNotif("Waiting for payment");

          setTimeout(() => {
            navigate("/trackingbuku");
          }, 1500);

        },

        onClose: function () {

          showNotif("Payment cancelled");

          setTimeout(() => {
            navigate("/trackingbuku");
          }, 1500);

        },

      });

    } catch (err) {

      console.log(err);

      showNotif("Checkout failed");

    }

  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">

      {/* NOTIFICATION */}
      {notif && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">

          <div className="bg-black/80 text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-medium transition-opacity duration-30">
            {notif}
          </div>

        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow">

        <h1 className="text-3xl font-bold text-blue-700 mb-8">
          Checkout
        </h1>

        {/* FORM */}
        <div className="space-y-4">

          <input
            type="text"
            placeholder="Recipient Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <textarea
            placeholder="Full Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-3 rounded-xl h-32"
          />

        </div>

        {/* ITEM LIST */}
        <div className="mt-8 space-y-4">

          {items.map((item, index) => (

            <div
              key={index}
              className="flex justify-between border-b pb-3"
            >

              <div>

                <h2 className="font-semibold">
                  {item.title}
                </h2>

                <p className="text-sm text-gray-500">
                  Qty: {item.qty || 1}
                </p>

              </div>

              <p className="font-bold text-blue-600">
                Rp {item.price?.toLocaleString("id-ID")}
              </p>

            </div>

          ))}

        </div>

        {/* TOTAL */}
        <div className="mt-8 flex justify-between items-center">

          <div>

            <p className="text-gray-500">
              Total
            </p>

            <h2 className="text-2xl font-bold text-blue-700">
              Rp {total.toLocaleString("id-ID")}
            </h2>

          </div>

          <button
            onClick={handlePayment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Proceed Payment
          </button>

        </div>

      </div>

    </div>
  );
}
import { useEffect, useState } from "react";

import {
  FiTruck,
  FiCheckCircle,
  FiMapPin,
  FiPhone,
  FiUser,
  FiPackage,
} from "react-icons/fi";

export default function CourierPage() {

  const [orders, setOrders] =
    useState([]);

  /* ================= FETCH ================= */
  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders =
    async () => {

      try {

        const res =
          await fetch(
            "http://localhost:3000/api/admin/courier-orders"
          );

        const data =
          await res.json();

        setOrders(data);

      } catch (err) {

        console.log(err);

      }

    };

  /* ================= UPDATE STATUS ================= */
  const updateStatus =
    async (id, status) => {

      try {

        await fetch(
          `http://localhost:3000/api/admin/orders/${id}/status`,
          {

            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              order_status:
                status,

            }),

          }
        );

        fetchOrders();

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div className="min-h-screen bg-[#f5f7fb]">

      {/* HEADER */}
      <div className="bg-blue-600 text-white px-6 py-5 shadow">

        <div className="max-w-7xl mx-auto flex items-center gap-3">

          <FiTruck className="text-3xl" />

          <div>

            <h1 className="text-2xl font-bold">
              Courier Dashboard
            </h1>

            <p className="text-blue-100 text-sm">
              Manage delivery orders
            </p>

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        <div className="grid gap-6">

          {orders.map((order) => (

            <div
              key={order.id}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5"
            >

              <div className="flex flex-col lg:flex-row gap-6 justify-between">

                {/* LEFT */}
                <div className="flex gap-5">

                  <img
                    src={`https://covers.openlibrary.org/b/id/${order.cover}-L.jpg`}
                    alt={order.title}
                    className="w-28 h-40 object-cover rounded-2xl"
                  />

                  <div>

                    {/* BOOK */}
                    <div className="mb-5">

                      <h2 className="text-2xl font-bold text-gray-800">
                        {order.title}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        Order ID:
                        {" "}
                        {order.order_id}
                      </p>

                      <p className="text-blue-600 font-bold mt-3 text-lg">
                        Rp{" "}
                        {order.amount?.toLocaleString(
                          "id-ID"
                        )}
                      </p>

                    </div>

                    {/* CUSTOMER */}
                    <div className="space-y-3 text-sm">

                      <div className="flex items-center gap-2 text-gray-700">

                        <FiUser />

                        <span>
                          {
                            order.address
                              ?.receiver_name
                          }
                        </span>

                      </div>

                      <div className="flex items-center gap-2 text-gray-700">

                        <FiPhone />

                        <span>
                          {
                            order.address
                              ?.phone
                          }
                        </span>

                      </div>

                      <div className="flex items-start gap-2 text-gray-700">

                        <FiMapPin className="mt-1" />

                        <span>
                          {
                            order.address
                              ?.full_address
                          }
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex flex-col justify-between gap-5">

                  {/* STATUS */}
                  <div>

                    {order.order_status ===
                      "processing" && (

                      <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2">

                        <FiPackage />

                        Processing

                      </div>

                    )}

                    {order.order_status ===
                      "shipping" && (

                      <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2">

                        <FiTruck />

                        Shipping

                      </div>

                    )}

                    {order.order_status ===
                      "completed" && (

                      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2">

                        <FiCheckCircle />

                        Completed

                      </div>

                    )}

                  </div>

                  {/* BUTTON */}
                  <div className="flex flex-col sm:flex-row gap-3">

                    {order.order_status ===
                      "processing" && (

                      <button
                        onClick={() =>
                          updateStatus(
                            order.id,
                            "shipping"
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold transition"
                      >
                        Start Delivery
                      </button>

                    )}

                    {order.order_status ===
                      "shipping" && (

                      <button
                        onClick={() =>
                          updateStatus(
                            order.id,
                            "completed"
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-semibold transition"
                      >
                        Complete Order
                      </button>

                    )}

                  </div>

                </div>

              </div>

            </div>

          ))}

          {/* EMPTY */}
          {orders.length === 0 && (

            <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">

              <FiTruck className="text-5xl text-gray-300 mx-auto mb-4" />

              <h2 className="text-2xl font-bold text-gray-700">
                No Orders Yet
              </h2>

              <p className="text-gray-400 mt-2">
                Delivery orders will appear here.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}
import { useEffect, useState } from "react";

import {
  FiTruck,
  FiCheckCircle,
  FiMapPin,
  FiPhone,
  FiUser,
  FiPackage,
  FiSearch,
} from "react-icons/fi";

export default function CourierPage() {

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

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

  /* ================= FILTER ================= */
  const filteredOrders =
  orders.filter((order) => {

    const keyword =
      search.toLowerCase();

    return (

      /* SEARCH TITLE */
      order.title
        ?.toLowerCase()
        .includes(keyword)

      ||

      /* SEARCH CUSTOMER */
      order.address
        ?.receiver_name
        ?.toLowerCase()
        .includes(keyword)

      ||

      /* SEARCH ORDER ID */
      order.order_id
        ?.toString()
        .toLowerCase()
        .includes(keyword)

    );

  });

  return (

    <div className="min-h-screen bg-[#f4f7fb]">

      {/* ───────── HEADER ───────── */}
      <header className="
        sticky
        top-0
        z-30
        border-b
        border-slate-200/60
        bg-white/85
        backdrop-blur-xl
      ">

        <div className="
          flex
          items-center
          gap-2 md:gap-3
          px-3 md:px-5
          py-3
        ">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            <div className="
              w-9
              h-9
              rounded-xl
              bg-linear-to-br
              from-blue-600
              to-indigo-600
              flex
              items-center
              justify-center
              shadow-md
              shadow-blue-500/20
            ">

              <FiTruck className="w-4 h-4 text-white" />

            </div>

            <span className="
              font-black
              text-slate-800
              text-base
              hidden sm:block
              tracking-tight
            ">

              Courier Dashboard

            </span>

          </div>

          <div className="flex-1" />

          {/* SEARCH */}
          <div className="relative hidden sm:block">

            <FiSearch className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              w-4
              h-4
              text-slate-400
            " />

            <input
              type="text"
              placeholder="Search data..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-56
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-9
                pr-4
                py-2
                text-sm
                outline-none
                focus:border-blue-400
                focus:bg-white
                transition-all
              "
            />

          </div>

          {/* PROFILE */}
          <div className="
            w-9
            h-9
            rounded-full
            bg-linear-to-br
            from-blue-600
            to-indigo-600
            flex
            items-center
            justify-center
            text-white
            font-bold
            text-sm
            shadow-md
            shadow-blue-500/20
            ring-2
            ring-white
          ">

            R

          </div>

        </div>

      </header>

      {/* MOBILE SEARCH */}
      <div className="
        sm:hidden
        px-4
        pt-4
      ">

        <div className="relative">

          <FiSearch className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            w-4
            h-4
            text-slate-400
          " />

          <input
            type="text"
            placeholder="Search data..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              pl-9
              pr-4
              py-2.5
              text-sm
              outline-none
              focus:border-blue-400
            "
          />

        </div>

      </div>

      {/* ───────── CONTENT ───────── */}
      <div className="
        max-w-7xl
        mx-auto
        px-4
        md:px-6
        py-8
      ">

        {/* STATS */}
        <div className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-4
          mb-8
        ">

          {/* TOTAL */}
          <div className="
            bg-white
            rounded-3xl
            p-5
            shadow-sm
            border border-gray-100
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-sm
                  text-gray-400
                ">

                  Total Orders

                </p>

                <h2 className="
                  text-3xl
                  font-black
                  text-gray-800
                  mt-2
                ">

                  {orders.length}

                </h2>

              </div>

              <div className="
                w-12
                h-12
                rounded-2xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              ">

                <FiPackage className="text-xl" />

              </div>

            </div>

          </div>

          {/* PROCESSING */}
          <div className="
            bg-white
            rounded-3xl
            p-5
            shadow-sm
            border border-gray-100
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-sm
                  text-gray-400
                ">

                  Processing

                </p>

                <h2 className="
                  text-3xl
                  font-black
                  text-indigo-600
                  mt-2
                ">

                  {
                    orders.filter(
                      (o) =>
                        o.order_status ===
                        "processing"
                    ).length
                  }

                </h2>

              </div>

              <div className="
                w-12
                h-12
                rounded-2xl
                bg-indigo-50
                text-indigo-600
                flex
                items-center
                justify-center
              ">

                <FiPackage className="text-xl" />

              </div>

            </div>

          </div>

          {/* SHIPPING */}
          <div className="
            bg-white
            rounded-3xl
            p-5
            shadow-sm
            border border-gray-100
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-sm
                  text-gray-400
                ">

                  Shipping

                </p>

                <h2 className="
                  text-3xl
                  font-black
                  text-blue-600
                  mt-2
                ">

                  {
                    orders.filter(
                      (o) =>
                        o.order_status ===
                        "shipping"
                    ).length
                  }

                </h2>

              </div>

              <div className="
                w-12
                h-12
                rounded-2xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              ">

                <FiTruck className="text-xl" />

              </div>

            </div>

          </div>

          {/* COMPLETED */}
          <div className="
            bg-white
            rounded-3xl
            p-5
            shadow-sm
            border border-gray-100
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-sm
                  text-gray-400
                ">

                  Completed

                </p>

                <h2 className="
                  text-3xl
                  font-black
                  text-green-600
                  mt-2
                ">

                  {
                    orders.filter(
                      (o) =>
                        o.order_status ===
                        "completed"
                    ).length
                  }

                </h2>

              </div>

              <div className="
                w-12
                h-12
                rounded-2xl
                bg-green-50
                text-green-600
                flex
                items-center
                justify-center
              ">

                <FiCheckCircle className="text-xl" />

              </div>

            </div>

          </div>

        </div>

        {/* ORDERS */}
        <div className="grid gap-6">

          {filteredOrders.map((order) => (

            <div
              key={order.id}
              className="
                bg-white
                rounded-[32px]
                shadow-sm
                hover:shadow-xl
                transition-all
                duration-300
                border border-gray-100
                p-5 md:p-6
              "
            >

              <div className="
                flex
                flex-col
                lg:flex-row
                gap-6
                justify-between
              ">

                {/* LEFT */}
                <div className="
                  flex
                  flex-col
                  sm:flex-row
                  gap-5
                ">

                  {/* COVER */}
                  <img
                    src={`https://covers.openlibrary.org/b/id/${order.cover}-L.jpg`}
                    alt={order.title}
                    className="
                      w-24 md:w-28
                      h-36 md:h-40
                      object-cover
                      rounded-3xl
                      shadow-md
                    "
                  />

                  {/* INFO */}
                  <div>

                    <div className="mb-5">

                      <h2 className="
                        text-xl md:text-2xl
                        font-black
                        text-gray-800
                        leading-tight
                      ">

                        {order.title}

                      </h2>

                      <p className="
                        text-gray-500
                        mt-1
                      ">

                        Order ID:
                        {" "}
                        {order.order_id}

                      </p>

                      <p className="
                        text-blue-600
                        font-black
                        mt-3
                        text-xl
                      ">

                        Rp{" "}
                        {order.amount?.toLocaleString(
                          "id-ID"
                        )}

                      </p>

                    </div>

                    {/* CUSTOMER */}
                    <div className="
                      space-y-3
                      text-sm
                    ">

                      <div className="
                        flex
                        items-center
                        gap-2
                        text-gray-700
                      ">

                        <FiUser className="text-gray-400" />

                        <span>
                          {
                            order.address
                              ?.receiver_name
                          }
                        </span>

                      </div>

                      <div className="
                        flex
                        items-center
                        gap-2
                        text-gray-700
                      ">

                        <FiPhone className="text-gray-400" />

                        <span>
                          {
                            order.address
                              ?.phone
                          }
                        </span>

                      </div>

                      <div className="
                        flex
                        items-start
                        gap-2
                        text-gray-700
                      ">

                        <FiMapPin className="
                          mt-1
                          text-gray-400
                        " />

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
                <div className="
                  flex
                  flex-col
                  justify-between
                  gap-5
                ">

                  {/* STATUS */}
                  <div>

                    {order.order_status ===
                      "processing" && (

                      <div className="
                        bg-indigo-50
                        text-indigo-700
                        border border-indigo-200
                        shadow-sm
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-semibold
                        inline-flex
                        items-center
                        gap-2
                      ">

                        <FiPackage />

                        Processing

                      </div>

                    )}

                    {order.order_status ===
                      "shipping" && (

                      <div className="
                        bg-blue-50
                        text-blue-700
                        border border-blue-200
                        shadow-sm
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-semibold
                        inline-flex
                        items-center
                        gap-2
                      ">

                        <FiTruck />

                        Shipping

                      </div>

                    )}

                    {order.order_status ===
                      "completed" && (

                      <div className="
                        bg-green-50
                        text-green-700
                        border border-green-200
                        shadow-sm
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-semibold
                        inline-flex
                        items-center
                        gap-2
                      ">

                        <FiCheckCircle />

                        Completed

                      </div>

                    )}

                  </div>

                  {/* BUTTON */}
                  <div className="
                    flex
                    flex-col
                    sm:flex-row
                    gap-3
                  ">

                    {order.order_status ===
                      "processing" && (

                      <button
                        onClick={() =>
                          updateStatus(
                            order.id,
                            "shipping"
                          )
                        }
                        className="
                          bg-gradient-to-r
                          from-blue-600
                          to-blue-700
                          hover:scale-[1.02]
                          active:scale-95
                          text-white
                          px-5
                          py-3
                          rounded-2xl
                          font-semibold
                          transition-all
                          shadow-lg
                        "
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
                        className="
                          bg-gradient-to-r
                          from-green-500
                          to-green-600
                          hover:scale-[1.02]
                          active:scale-95
                          text-white
                          px-5
                          py-3
                          rounded-2xl
                          font-semibold
                          transition-all
                          shadow-lg
                        "
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
          {filteredOrders.length === 0 && (

            <div className="
              bg-white
              rounded-[32px]
              p-12
              text-center
              border border-gray-100
              shadow-sm
            ">

              <div className="
                w-24
                h-24
                rounded-full
                bg-blue-50
                flex
                items-center
                justify-center
                mx-auto
                mb-5
              ">

                <FiTruck className="
                  text-5xl
                  text-blue-400
                " />

              </div>

              <h2 className="
                text-3xl
                font-black
                text-gray-700
              ">

                No Orders Yet

              </h2>

              <p className="
                text-gray-400
                mt-3
                text-lg
              ">

                Delivery orders will appear here.

              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}
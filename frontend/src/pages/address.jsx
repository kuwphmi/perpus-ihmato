import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEdit2, FiCheck } from "react-icons/fi";

export default function Address() {

  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    label: "",
    receiver_name: "",
    phone: "",
    district: "",
    full_address: "",
    postal_code: "",
  });

  const districts = [
    "Asemrowo",
    "Benowo",
    "Bubutan",
    "Bulak",
    "Dukuh Pakis",
    "Gayungan",
    "Genteng",
    "Gubeng",
    "Gunung Anyar",
    "Jambangan",
    "Karangpilang",
    "Kenjeran",
    "Krembangan",
    "Lakarsantri",
    "Mulyorejo",
    "Pabean Cantikan",
    "Pakal",
    "Rungkut",
    "Sambikerep",
    "Sawahan",
    "Semampir",
    "Simokerto",
    "Sukolilo",
    "Sukomanunggal",
    "Tambaksari",
    "Tandes",
    "Tegalsari",
    "Tenggilis Mejoyo",
    "Wiyung",
    "Wonocolo",
    "Wonokromo",
  ];

  useEffect(() => {

    fetchAddresses();

  }, []);

  const fetchAddresses = async () => {

    try {

      const userData = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `http://localhost:3000/api/address/${userData.id}`
      );

      setAddresses(Array.isArray(res.data) ? res.data : []);

    } catch (err) {

      console.log(err);

    }

  };

  const saveAddress = async () => {

    try {

      if (
        !form.label ||
        !form.receiver_name ||
        !form.phone ||
        !form.district ||
        !form.full_address
      ) {
        alert("Please complete all fields");
        return;
      }

      const userData = JSON.parse(localStorage.getItem("user"));

      if (editId) {

        await axios.put(
          `http://localhost:3000/api/address/${editId}`,
          {
            label: form.label,
            receiver_name: form.receiver_name,
            phone: form.phone,
            district: form.district,
            postal_code: form.postal_code,
            full_address: form.full_address,
          }
        );

        alert("Address updated!");

      } else {

        await axios.post(
          "http://localhost:3000/api/address",
          {
            user_id: userData.id,

            label: form.label,
            receiver_name: form.receiver_name,
            phone: form.phone,
            district: form.district,
            postal_code: form.postal_code,
            full_address: form.full_address,

            is_primary: addresses.length === 0,
          }
        );

        alert("Address saved!");

      }

      setForm({
        label: "",
        receiver_name: "",
        phone: "",
        district: "",
        full_address: "",
        postal_code: "",
      });

      setEditId(null);

      setShowForm(false);

      fetchAddresses();

    } catch (err) {

      console.log(err);

      alert("Failed");

    }

  };

  const handleEdit = (item) => {

    setShowForm(true);

    setEditId(item.id);

    setForm({
      label: item.label,
      receiver_name: item.receiver_name,
      phone: item.phone,
      district: item.district,
      postal_code: item.postal_code,
      full_address: item.full_address,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  const setPrimaryAddress = async (id) => {

    try {

      await axios.put(
        `http://localhost:3000/api/address/primary/${id}`
      );

      fetchAddresses();

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-blue-600 text-white px-6 py-5 shadow-md">

        <div className="max-w-5xl mx-auto flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-bold">
              My Addresses
            </h1>

            <p className="text-sm text-blue-100 mt-1">
              Manage your shipping addresses
            </p>

          </div>

          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm"
          >
            Back
          </button>

        </div>

      </div>

      <div className="max-w-5xl mx-auto p-6">

        {/* BUTTON */}
        <div className="flex justify-end mb-6">

          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditId(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium shadow"
          >
            {showForm ? "Close Form" : "+ Add Address"}
          </button>

        </div>

        {/* FORM */}
        {showForm && (

          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

            <h3 className="text-lg font-semibold mb-5">
              {editId ? "Edit Address" : "Add New Address"}
            </h3>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="Label (Home / Kost)"
                value={form.label}
                onChange={(e) =>
                  setForm({
                    ...form,
                    label: e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="text"
                placeholder="Receiver Name"
                value={form.receiver_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    receiver_name: e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3"
              />

              <select
                value={form.district}
                onChange={(e) =>
                  setForm({
                    ...form,
                    district: e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3"
              >
                <option value="">
                  Select District
                </option>

                {districts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}

              </select>

              <input
                type="text"
                placeholder="Postal Code"
                value={form.postal_code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    postal_code: e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3 md:col-span-2"
              />

              <textarea
                placeholder="Full Address"
                value={form.full_address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    full_address: e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3 h-32 resize-none md:col-span-2"
              />

            </div>

            <button
              onClick={saveAddress}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
            >
              {editId ? "Update Address" : "Save Address"}
            </button>

          </div>

        )}

        {/* EMPTY */}
        {addresses.length === 0 && (

          <div className="bg-white rounded-2xl border border-dashed p-12 text-center text-gray-400">
            No address added yet
          </div>

        )}

        {/* LIST */}
        <div className="space-y-5">

          {addresses.map((item) => (

            <div
              key={item.id}
              onClick={() => setPrimaryAddress(item.id)}
              className={`bg-white rounded-2xl shadow-md p-6 cursor-pointer transition border-2
              ${item.is_primary
                  ? "border-blue-600"
                  : "border-transparent hover:border-blue-200"
                }`}
            >

              <div className="flex justify-between gap-5">

                <div>

                  <div className="flex items-center gap-2 mb-3">

                    <h3 className="font-semibold text-lg text-gray-800">
                      {item.label}
                    </h3>

                    {item.is_primary && (
                      <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <FiCheck />
                        Main Address
                      </span>
                    )}

                  </div>

                  <p className="font-medium text-gray-700">
                    {item.receiver_name}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.phone}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    {item.district}, Surabaya
                  </p>

                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    {item.full_address}
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    Postal Code: {item.postal_code}
                  </p>

                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                  }}
                  className="h-fit p-3 rounded-xl hover:bg-gray-100"
                >
                  <FiEdit2 className="text-gray-600" />
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}
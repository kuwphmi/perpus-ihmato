import axios from "axios";

export default function BookCard({
  title,
  author,
  cover,
  price,
  stock,
  cart,
  setCart,
}) {
  const tambahKeKeranjang = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Silakan login dulu");
        return;
      }

      const payload = {
        user_id: user.id,
        title,
        author,
        cover,
        price,
        stock,
      };

      const res = await axios.post(
        "http://localhost:3000/api/cart",
        payload
      );

      if (res.data.status) {
        setCart((prev) => {
          if (!Array.isArray(prev)) prev = [];
          return [...prev, res.data.data];
        });

        alert("Buku masuk keranjang");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Terjadi error");
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden w-[250px] flex flex-col">

      {/* COVER */}
      <div className="h-48 bg-blue-100 flex items-center justify-center">
        {cover ? (
          <img
            src={`https://covers.openlibrary.org/b/id/${cover}-M.jpg`}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-500 text-sm">No Cover</span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col h-full">

        <h3 className="text-sm font-bold text-gray-800 line-clamp-2">
          {title}
        </h3>

        <p className="text-blue-600 text-xs mb-2">
          {author}
        </p>

        <div className="mt-auto">

          <div className="flex justify-between items-center mb-3">
            <p className="text-blue-700 font-bold text-sm">
              Rp {(price || 0).toLocaleString("id-ID")}
            </p>

            <p className="text-xs text-gray-500">
              Stok: {stock}
            </p>
          </div>

          {/* BUTTON */}
          <div className="flex gap-2">

            <button
              onClick={tambahKeKeranjang}
              className="flex-1 border border-blue-600 text-blue-600 text-xs py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Keranjang
            </button>

            <button className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg hover:bg-blue-700 transition">
              Beli
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
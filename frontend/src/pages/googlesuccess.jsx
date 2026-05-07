import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function GoogleSuccess() {
  const [params] = useSearchParams();

  useEffect(() => {
    // ambil user dari query URL
    const user = params.get("user");

    if (user) {
      // ubah jadi object
      const parsedUser = JSON.parse(
        decodeURIComponent(user)
      );

      // simpan user login
      localStorage.setItem(
        "user",
        JSON.stringify(parsedUser)
      );

      // redirect ke halaman utama
      window.location.href = "/halamanutama";
    } else {
      // kalau gagal login
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      Loading...
    </div>
  );
}
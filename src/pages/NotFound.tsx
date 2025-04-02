
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-jalan-background p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-jalan-text">404</h1>
        <p className="text-xl text-jalan-secondary mb-6">Halaman tidak ditemukan</p>
        <Link to="/" className="text-jalan-accent hover:brightness-110 transition-all">
          &gt; Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

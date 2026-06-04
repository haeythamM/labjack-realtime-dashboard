import Header from "../components/Header";
import Footer from "../components/Footer";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <main className="pt-20 sm:pt-24">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default Layout;

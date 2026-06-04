function Footer() {
  return (
    <footer className="mt-10 bg-gray-800 py-7 text-sm text-gray-300">
      <div className="mx-auto max-w-6xl px-4 text-center">
        © {new Date().getFullYear()} LabJack Dashboard. Built by Haeytham Almalak.
      </div>
    </footer>
  );
}

export default Footer;

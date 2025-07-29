import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-100">Arbitraj Bot</h1>
      <ul className="flex space-x-6 text-gray-400">
        <li className="hover:text-gray-100 cursor-pointer">
          <Link href="/">Homepage</Link>
        </li>
        <li className="hover:text-gray-100 cursor-pointer">
          <Link href="/favorites">Favorites</Link>
        </li>
        <li className="hover:text-gray-100 cursor-pointer">
          <Link href="/arbitrage">Arbitrage</Link>
        </li>
      </ul>
    </nav>
  );
}

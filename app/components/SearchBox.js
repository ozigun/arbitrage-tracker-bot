export default function SearchBox({ searchTerm, setSearchTerm }) {
  return (
    <input
      type="text"
      placeholder="Search coin..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full max-w-sm p-2 mb-6 rounded-md bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-blue-500"
    />
  );
}

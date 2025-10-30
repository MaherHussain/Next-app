'use client'
import {useState} from 'react'
import { FiSearch } from 'react-icons/fi'
interface SearchInputProps {
  onSearch: (query: string) => void
}   

function SearchInput({ onSearch }: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  }
  function clearSearch() {
    setSearchTerm('');
    onSearch('');
  }

  return (
    <div className="flex items-center my-2 border rounded-lg px-3 py-2 bg-white shadow-sm w-full ">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
      />
      <div className="text-gray-400 ml-2 flex items-center space-x-2">
        {searchTerm ? (
          <span
            onClick={clearSearch}
            className="text-lg select-none cursor-pointer"
          >
            ×
          </span>
        ) : (
          <FiSearch size={20} />
        )}
      </div>
    </div>
  );
}

export default SearchInput
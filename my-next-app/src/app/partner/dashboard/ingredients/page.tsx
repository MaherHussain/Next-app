'use client'

import {useState} from 'react'
import { IngredientList } from './components'
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoIosAdd } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { IngredientModal } from "./components";

export default function Page() {
  const [listCount, setListCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  return (
    <div className="p-6">
      <div className="flex flex-row justify-between">
        <button
          onClick={() => router.push("/partner/dashboard/products")}
          className=" flex flex-row items-center gap-2 mb-4  text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
        >
          <FaArrowLeftLong />
          <span>back to products</span>
        </button>
        <button
          onClick={() => router.push("/partner/dashboard/ingredients-group")}
          className=" flex flex-row items-center gap-2 mb-4  text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
        >
          <FaArrowLeftLong />
          <span>manage ingredients groups</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Ingredients ({listCount})
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-between space-x-2 text-center px-10 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 "
        >
          <span>Add</span>
          <span>
            <IoIosAdd className="h-5 w-5" />
          </span>
        </button>
      </div>
      <IngredientList onTotalChange={setListCount} />
      {isModalOpen && (
        <IngredientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

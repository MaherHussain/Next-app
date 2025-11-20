'use client'
import {useState} from 'react'
import { IngredientsGroupList, IngredientsGroupModal } from "./components/";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { IoIosAdd } from "react-icons/io";
function page() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => router.push("/partner/dashboard/ingredients")}
        className=" flex flex-row items-center gap-2 mb-4  text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
      >
        <FaArrowLeftLong />
        <span>back to ingredients</span>
      </button>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ingredients Groups</h1>
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

      <IngredientsGroupList />
      <IngredientsGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default page

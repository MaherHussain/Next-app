'use client'
import {useState} from 'react'
import { IngredientsGroupList } from './components/';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();

  return (
    <div>
      <button onClick={() => router.push("/partner/dashboard/ingredients")}
        className=" flex flex-row items-center gap-2 mb-4  text-gray-600 hover:text-gray-800 font-medium cursor-pointer">
        < FaArrowLeftLong />
        <span>back to ingredients</span>
      </button>
      <h1 className="text-2xl font-bold">Ingredients Groups</h1>
      <IngredientsGroupList />
    </div>
  )
}

export default page

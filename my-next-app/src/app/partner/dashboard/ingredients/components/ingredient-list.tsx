
'use client';
import {useEffect, useState} from "react";
import LoadingSpinner from '@/app/components/shared/loading-spinner';
import SearchInput from '@/app/components/shared/Searchinput';
import { PriceFormatter } from "@/app/utils/helpers/helpers";
import {
  useGetIngredients,
  useDeleteIngredient,
} from "@/app/queries/ingredients";
import { useUser } from "@/app/utils/providers/UserContext";
import { LiaPenSolid } from "react-icons/lia";
import { MdDelete } from "react-icons/md";
import { IngredientDeleteDialog, IngredientModal } from "./";

interface ingredient {
  _id: string;
  name: string;
  cost?: number | null;
  createdAt?: string;
} 

function IngredientList({
  onTotalChange,
}: {
  onTotalChange?: (total: number) => void;
}) {
  const { user } = useUser();

  const [page, setPage] = useState(1);
  const limit = 10;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ingredientToEdit, setIngredientToEdit] = useState<
    ingredient | undefined
  >(undefined);

  const [selectedIngredientToDelete, setSelectedIngredientToDelete] =
    useState<ingredient | null>(null);

  const restaurantId =
    typeof user?.restaurantId === "string"
      ? user.restaurantId
      : user?.restaurantId?._id ?? "";

  const { data, error, isLoading } = useGetIngredients({
    restaurantId,
    page,
    limit,
  });
  const totalIngredients = data?.meta.total || 0;
  const totalPages = data?.meta?.totalPages || 1;

  /* const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  }; */

  useEffect(() => {
    if (onTotalChange) {
      onTotalChange(totalIngredients);
    }
  }, [totalIngredients, onTotalChange]);

  const { mutate: deleteMutate } = useDeleteIngredient();

  return (
    <div className="p-4 mt-4 bg-white max-h-screen overflow-y-auto rounded-lg shadow">
      {/* <SearchInput onSearch={handleSearch} /> */}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex flex-row justify-center mt-6">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className="text-red-500 p-4">Error loading ingredients.</div>
      ) : !data ? (
        <div className="text-gray-500 p-4">
          No ingredients have been added yet, click add button to start.
        </div>
      ) : (
        <div>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left font-semibold w-1/2">
                  Name
                </th>
                <th className="py-2 px-4 text-left font-semibold w-1/3">
                  Cost
                </th>
                <th className="py-2 px-4 text-left font-semibold "></th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((ingredient: ingredient) => (
                <tr key={ingredient._id} className="border-t">
                  <td className="py-2 px-4">{ingredient.name}</td>
                  <td className="py-2 px-4">
                    {PriceFormatter(ingredient.cost ?? 0)}
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => {
                        setIngredientToEdit(ingredient);
                        setIsEditModalOpen(true);
                      }}
                      className="bg-blue-200 text-blue-700 px-3 py-1 rounded "
                    >
                      <LiaPenSolid />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedIngredientToDelete(ingredient);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="bg-red-200 text-red-700 px-3 py-1 rounded"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="px-2">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isDeleteDialogOpen && (
        <IngredientDeleteDialog
          ingredientName={selectedIngredientToDelete?.name}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onProceed={() => {
            if (selectedIngredientToDelete) {
              deleteMutate(selectedIngredientToDelete._id);
            }
            setIsDeleteDialogOpen(false);
          }}
        />
      )}
      {isEditModalOpen && (
        <IngredientModal
          isOpen={isEditModalOpen}
          isEditAction={true}
          ingredientToEdit={ingredientToEdit}
          onClose={() => {
            setIsEditModalOpen(false);
            setIngredientToEdit(undefined);
          }}
        />
      )}
    </div>
  );
}

export default IngredientList
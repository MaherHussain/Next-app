'use client'
import { useState } from "react";
import {
  useGetIngredientsGroups,
  useDeleteIngredientGroup,
} from "@/app/queries/ingredients-groups";
import { useUser } from "@/app/utils/providers/UserContext";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import { MdDelete } from "react-icons/md";
import { LiaPenSolid } from "react-icons/lia";
import { IngredientsGroupModal, IngredientsGroupDeleteDialog } from ".";
import { showToast } from "@/app/utils/toast";

interface IngredientGroup {
  _id: string;
  name: string;
  ingredients: string[];
  createdAt: string;
  updatedAt: string;
}

function IngredientsGroupList() {
  const { user } = useUser();
  const restaurantId =
    typeof user?.restaurantId === "string"
      ? user.restaurantId
      : user?.restaurantId?._id ?? "";
  const { data, isLoading, error } = useGetIngredientsGroups({ restaurantId });
  const { mutate: deleteIngredientGroup } = useDeleteIngredientGroup();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ingredientsGroupToEdit, setIngredientsGroupToEdit] =
    useState<IngredientGroup | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ingredientsGroupToDelete, setIngredientsGroupToDelete] =
    useState<IngredientGroup | null>(null);

  function onProceedDelete() {
    if (ingredientsGroupToDelete) {
      deleteIngredientGroup(ingredientsGroupToDelete._id, {
        onSuccess: () => {
          setIngredientsGroupToDelete(null);
          setIsDeleteDialogOpen(false);
          showToast.warning("Ingredient group deleted successfully");
        },
      });
    }
  }
  return (
    <div className="p-4 mt-4 bg-white max-h-screen overflow-y-auto rounded-lg shadow">
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className="text-red-500 p-4">Error loading ingredients groups</div>
      ) : !data ? (
        <div className="text-gray-500 p-4">
          No ingredients groups have been added yet, click add button to start.
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
                  ingredients
                </th>
                <th className="py-2 px-4 text-left font-semibold "></th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((group: IngredientGroup) => (
                <tr key={group._id} className="border-t">
                  <td className="py-2 px-4">{group.name}</td>
                  <td className="py-2 grid grid-cols-4 px-4 ">
                    {group.ingredients.map((ing: any) => (
                      <div
                        key={ing._id}
                        className="m-1 p-1 truncate text-left rounded"
                      >
                        <span>{ing.name}</span>
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => {
                        setIngredientsGroupToEdit(group);
                        setIsEditModalOpen(true);
                      }}
                      className="bg-blue-200 text-blue-700 px-3 py-1 rounded "
                    >
                      <LiaPenSolid />
                    </button>
                    <button
                      onClick={() => {
                        setIngredientsGroupToDelete(group);
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
        </div>
      )}
      {isEditModalOpen && ingredientsGroupToEdit && (
        <IngredientsGroupModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setIngredientsGroupToEdit(null);
          }}
          ingredientsGroupToEdit={ingredientsGroupToEdit}
          isEditingAction={true}
        />
      )}
      {isDeleteDialogOpen && (
        <IngredientsGroupDeleteDialog
          ingredientsGroupName={ingredientsGroupToDelete?.name}
          onCancel={() => {
            setIsDeleteDialogOpen(false);
            setIngredientsGroupToDelete(null);
          }}
          onProceed={() => {
            onProceedDelete();
          }}
        />
      )}
    </div>
  );
}

export default IngredientsGroupList
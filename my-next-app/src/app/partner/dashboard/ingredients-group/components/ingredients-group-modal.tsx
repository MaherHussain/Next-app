'use client'
import { useEffect, useState } from "react";
import { useGetAllIngredients } from "@/app/queries/ingredients";
import { useUser } from "@/app/utils/providers/UserContext";
import {
  useAddIngredientGroup,
  useEditIngredientGroup,
} from "@/app/queries/ingredients-groups";
import { showToast } from "@/app/utils/toast";

interface IngredientsGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredientsGroupToEdit?: {
    _id: string;
    name: string;
    ingredients: string[];
  };
  isEditingAction?: boolean;
}

function IngredientsGroupModal({
  isOpen,
  onClose,
  ingredientsGroupToEdit,
  isEditingAction,
}: IngredientsGroupModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    ingredients: string[];
  }>({ name: "", ingredients: [] });
  const { user } = useUser();

  const restaurantId =
    typeof user?.restaurantId === "string"
      ? user.restaurantId
      : user?.restaurantId?._id ?? "";

  useEffect(() => {
    if (isEditingAction && ingredientsGroupToEdit) {
      setFormData({
        name: ingredientsGroupToEdit.name,
        ingredients: ingredientsGroupToEdit.ingredients.map((ing: any) =>
          typeof ing === "string" ? ing : ing._id
        ),
      });
    } else {
      setFormData({ name: "", ingredients: [] });
    }
  }, [isEditingAction, ingredientsGroupToEdit]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleIngredientToggle(ingredientId: string) {
    setFormData((prev) => {
      const isSelected = prev.ingredients.includes(ingredientId);
      return {
        ...prev,
        ingredients: isSelected
          ? prev.ingredients.filter((id) => id !== ingredientId)
          : [...prev.ingredients, ingredientId],
      };
    });
  }

  const { mutate: addIngredientGroup } = useAddIngredientGroup();
  const { mutate: editIngredientGroup } = useEditIngredientGroup();

  function onSave() {
    if (isEditingAction && ingredientsGroupToEdit) {
      editIngredientGroup(
        {
          id: ingredientsGroupToEdit._id,
          name: formData.name,
          ingredients: formData.ingredients,
        },
        {
          onSuccess: () => {
            showToast.success(`Ingredient group updated successfully`);
            onClose();
          },
        }
      );
    } else {
      addIngredientGroup(
        { ...formData, restaurantId },
        {
          onSuccess: () => {
            showToast.success(`${formData.name} added successfully`);
            onClose();
          },
        }
      );
    }
  }
  const { data: ingredientsData, isLoading } = useGetAllIngredients({
    restaurantId,
  });
  const ingredients = ingredientsData?.data || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex flex-col justify-between  mb-4">
          <span
            className="text-xl w-full text-right hover:text-orange-500 cursor-pointer"
            onClick={onClose}
          >
            x
          </span>
          <h2 className="text-xl font-bold mb-4">Ingredients Group Modal</h2>
        </div>

        <form className="space-y-2">
          <div>
            <label className="block text-gray-700">Ingredient Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
              autoFocus
              placeholder="Please enter the name of the ingredient."
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Ingredients{" "}
              {formData.ingredients.length > 0 &&
                `(${formData.ingredients.length} selected)`}
            </label>
            {isLoading ? (
              <div className="text-gray-500">Loading ingredients...</div>
            ) : ingredients.length === 0 ? (
              <div className="text-gray-500">No ingredients available</div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-3 max-h-60 overflow-y-auto space-y-2">
                {ingredients.map((ingredient) => (
                  <label
                    key={ingredient._id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.ingredients.includes(ingredient._id)}
                      onChange={() => handleIngredientToggle(ingredient._id)}
                      className="appearance-none w-4 h-4 rounded-full border-2 border-gray-300 checked:bg-orange-500 checked:border-orange-500 relative checked:after:content-[''] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:w-2 checked:after:h-2 checked:after:bg-white checked:after:rounded-full accent-orange-500"
                    />
                    <span className="text-gray-700">{ingredient.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg"
              onClick={onSave}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IngredientsGroupModal
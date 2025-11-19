import {act, useEffect, useState} from 'react'
import { useAddIngredient, useEditIngredient } from "@/app/queries/ingredients";
import { useUser } from "@/app/utils/providers/UserContext";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import { showToast } from "@/app/utils/toast";

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditAction?: boolean;
  ingredientToEdit?: {
    _id: string;
    name: string;
    cost?: number | null;
  };
}

function IngredientModal({
  onClose,
  ingredientToEdit,
  isEditAction = false,
}: IngredientModalProps) {
  const [activeAction, setActiveAction] = useState<
    "addAnother" | "close" | null
  >(null);

  const [formData, setFormData] = useState<{
    name: string;
    cost: number | undefined;
  }>({ name: "", cost: undefined });

  const { user } = useUser();

  const restaurantId =
    typeof user?.restaurantId === "string"
      ? user.restaurantId
      : user?.restaurantId?._id ?? "";

  const {
    mutate: addIngredient,
    isPending: isAdding,
    isError,
    error,
  } = useAddIngredient();

  const { mutate: editIngredient } = useEditIngredient();

  const resetAfterMutation = () => setActiveAction(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  useEffect(() => {
    if (isEditAction && ingredientToEdit) {
      setFormData({
        name: ingredientToEdit.name || "",
        cost: ingredientToEdit.cost || 0,
      });
    } else {
      setFormData({ name: "", cost: 0 });
    }
  }, [isEditAction, ingredientToEdit]);

  const isFormValid = formData.name.trim() !== "";

  function handleSaveAndAddAnother(e: React.FormEvent) {
    e.preventDefault();
    setActiveAction("addAnother");
    addIngredient(
      {
        name: formData.name,
        cost: formData.cost || 0,
        restaurantId,
      },
      {
        onSuccess: () => {
          showToast.success(`${formData.name} added successfully`);
          setFormData({ name: "", cost: undefined });
        },
        onSettled: resetAfterMutation,
      }
    );
  }

  function handleSaveAndClose(e: React.FormEvent) {
    e.preventDefault();
    setActiveAction("close");
    if (!isFormValid) return;
    if (!ingredientToEdit) {
      addIngredient(
        {
          name: formData.name,
          cost: formData.cost || 0,
          restaurantId,
        },
        {
          onSuccess: () => {
            showToast.success(`${formData.name} added successfully`);
            onClose();
          },
          onSettled: resetAfterMutation,
        }
      );
    } else {
      editIngredient(
        {
          id: ingredientToEdit._id,
          name: formData.name,
          cost: formData.cost || 0,
        },
        {
          onSuccess: () => {
            showToast.success(`The ingredient updated successfully`);
            onClose();
          },
          onSettled: resetAfterMutation,
        }
      );
    }
  }

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
          <h2 className="text-xl font-bold mb-4">Ingredient Modal</h2>
        </div>

        <form className="space-y-2">
          {isError && <p className="text-red-500">{error}</p>}
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
            <p className="text-sm text-gray-500"></p>
          </div>
          <div>
            <label className="block text-gray-700">Ingredient Cost</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
              placeholder="Please enter the cost of the ingredient."
            />
          </div>
          <div className="flex flex-col gap-2">
            {!ingredientToEdit && (
              <button
                type="button"
                onClick={handleSaveAndAddAnother}
                className={`px-4 py-2 bg-blue-600 text-white rounded ${
                  isAdding || !isFormValid
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              >
                {isAdding && activeAction === "addAnother" && (
                  <LoadingSpinner size="small" />
                )}
                Save & Add Another
              </button>
            )}

            <button
              type="button"
              className={`px-4 py-2 bg-blue-600 text-white rounded ${
                isAdding || !isFormValid ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={isAdding || !isFormValid}
              onClick={handleSaveAndClose}
            >
              {isAdding && activeAction === "close" && (
                <LoadingSpinner size="small" />
              )}
              Save & Close
            </button>
            <button
              type="button"
              className="gap-2 my-4   text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IngredientModal
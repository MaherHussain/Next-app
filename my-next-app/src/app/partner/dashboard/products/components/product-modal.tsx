'use client'
import React, { useEffect, useState } from "react";
import { useAddProduct, useEditProduct } from "../../../../queries/products";
import { useUser } from "@/app/utils/providers/UserContext";
import { FiInfo } from "react-icons/fi";
import { useGetAllIngredients } from "@/app/queries/ingredients";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import { Ingredient } from "@/app/types";
import { showToast } from "@/app/utils/toast";

interface ProductAddModalProps {
  isOpen: boolean;
  isEditAction?: boolean;
  productToEdit?: {
    _id: string;
    name: string;
    price: number;
    active?: boolean;
    ingredients?: Ingredient[];
    imageUrl?: string;
  };
  onClose: () => void;
}

const ProductAddModal: React.FC<ProductAddModalProps> = ({
  isOpen,
  onClose,
  isEditAction = false,
  productToEdit,
}) => {
  const [productFormData, setProductFormData] = useState<{
    name: string;
    price: number | "";
    active: boolean;
    ingredients?: string[];
    imageUrl?: string;
  }>({ name: "", price: "", active: true, ingredients: [], imageUrl: "" });

  const [showInfoPopup, setShowInfoPopup] = useState(false);

  const { mutate: addProduct } = useAddProduct();

  const { mutate: editProduct } = useEditProduct();

  const ingredientsIds = productToEdit?.ingredients?.map((ing) => ing._id);

  useEffect(() => {
    if (isEditAction && productToEdit) {
      setProductFormData({
        name: productToEdit.name || "",
        price: productToEdit.price || "",
        active: productToEdit.active ?? true,
        ingredients: ingredientsIds || [],
        imageUrl: productToEdit.imageUrl || "",
      });
    } else {
      setProductFormData({
        name: "",
        price: "",
        active: true,
        ingredients: [],
        imageUrl: "",
      });
    }
  }, [isEditAction, productToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) || "" : value,
    }));
  };

  const handleToggleActive = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductFormData((prev) => ({
      ...prev,
      active: e.target.checked,
    }));
  };

  const { user } = useUser();
  const restaurantId =
    typeof user?.restaurantId === "string"
      ? user.restaurantId
      : user?.restaurantId?._id ?? "";

  const { data: ingredients, isLoading: isLoadingIngredients } =
    useGetAllIngredients({ restaurantId });

  function handleIngredientToggle(ingredientId: string) {
    setProductFormData((prev) => {
      const isSelected = prev.ingredients?.includes(ingredientId);
      return {
        ...prev,
        ingredients: isSelected
          ? prev.ingredients?.filter((id) => id !== ingredientId)
          : [...(prev.ingredients ?? []), ingredientId],
      };
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name || productFormData.price === "") return;
    const productNameSnapshot = productFormData.name;

    if (!isEditAction) {
      // handle add product
      addProduct(
        {
          name: productFormData.name,
          price: Number(productFormData.price),
          restaurantId,
          active: productFormData.active,
          ingredients: productFormData.ingredients ?? [],
          imageUrl: productFormData.imageUrl,
        },
        {
          onSuccess: () => {
            console.log("Product added successfully");
            showToast.success(
              `Product "${productNameSnapshot}" added successfully!`
            );
            setProductFormData({
              name: "",
              price: "",
              active: true,
              ingredients: [],
            });
            onClose();
          },
        }
      );
    }
    // Handle edit case
    if (productToEdit) {
      editProduct(
        {
          product: {
            id: productToEdit._id,
            name: productFormData.name,
            price: Number(productFormData.price),
            active: productFormData.active,
            ingredients: productFormData.ingredients ?? [],
            imageUrl: productFormData.imageUrl,
          },
        },
        {
          onSuccess: () => {
            console.log("Product edited successfully");
            showToast.success(
              `Product "${productNameSnapshot}" edited successfully!`
            );
            setProductFormData({
              name: "",
              price: "",
              active: true,
              ingredients: [],
            });
            onClose();
          },
        }
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40 flex items-center justify-center mt-0 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md ">
        <h2 className="text-xl font-semibold mb-4">
          {isEditAction ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded px-3 py-2"
              value={productFormData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              name="price"
              value={productFormData.price}
              onChange={handleChange}
              required
              min={0}
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 border-gray-300"
              value={productFormData.imageUrl}
              onChange={handleChange}
            />
            <p className="text-[10px] text-gray-400 mt-1">Provide a direct link to an image file.</p>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              Select default Ingredients
              {productFormData.ingredients?.length
                ? `(${productFormData.ingredients?.length} selected)`
                : null}
            </label>
            {isLoadingIngredients ? (
              <div className="text-gray-500">
                <LoadingSpinner size="small" />
              </div>
            ) : ingredients?.data?.length === 0 ? (
              <div className="text-gray-500">No ingredients available</div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-3 max-h-60 overflow-y-auto space-y-2">
                {ingredients?.data.map((ingredient) => (
                  <label
                    key={ingredient._id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={productFormData?.ingredients?.includes(
                        ingredient._id
                      )}
                      onChange={() => handleIngredientToggle(ingredient._id)}
                      className="appearance-none w-4 h-4 rounded-full border-2 border-gray-300 checked:bg-orange-500 checked:border-orange-500 relative checked:after:content-[''] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:w-2 checked:after:h-2 checked:after:bg-white checked:after:rounded-full accent-orange-500"
                    />
                    <span className="text-gray-700">{ingredient.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative inline-block">
              <input
                id="switch-component-green"
                type="checkbox"
                checked={productFormData.active}
                onChange={handleToggleActive}
                className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300"
              />
              <label
                htmlFor="switch-component-green"
                className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer"
              ></label>
            </div>

            <div className="flex items-center gap-1 relative">
              <label
                htmlFor="switch-component-green"
                className="text-sm font-medium cursor-pointer"
              >
                Product Active
              </label>
              <button
                type="button"
                className="relative"
                onMouseEnter={() => setShowInfoPopup(true)}
                onMouseLeave={() => setShowInfoPopup(false)}
                onClick={() => setShowInfoPopup(!showInfoPopup)}
              >
                <FiInfo className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
                {showInfoPopup && (
                  <div className="absolute left-0 top-6 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
                    <p>
                      When active, this product will be visible to customers and
                      available for ordering. When inactive, the product will be
                      hidden from the menu but can be reactivated later.
                    </p>
                    <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                  </div>
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {isEditAction ? "Edit" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductAddModal;

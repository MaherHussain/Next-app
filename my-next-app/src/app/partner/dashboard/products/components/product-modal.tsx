import React, { useEffect, useState } from "react";
import { useAddProduct, useEditProduct } from "../../../../queries/products";
import { useUser } from "@/app/utils/providers/UserContext";
import { FiInfo } from "react-icons/fi";

interface ProductAddModalProps {
  isOpen: boolean;
  isEditAction?: boolean;
  productToEdit?: {
    _id: string;
    name: string;
    price: number;
    active?: boolean;
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
  }>({ name: "", price: "", active: true });
  
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  
  const { mutate: addProduct } = useAddProduct();

  const { mutate: editProduct } = useEditProduct();

  useEffect(() => {
    if (isEditAction && productToEdit) {
      setProductFormData({
        name: productToEdit.name || "",
        price: productToEdit.price || "",
        active: productToEdit.active ?? true,
      });
    } else {
      setProductFormData({ name: "", price: "", active: true });
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
  const restaurantId = typeof user?.restaurantId === 'string' 
  ? user.restaurantId 
  : user?.restaurantId?._id ?? "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name || productFormData.price === "") return;
    if (!isEditAction) {
      // handle add product
      addProduct({
        name: productFormData.name,
        price: Number(productFormData.price),
        restaurantId,
        active: productFormData.active,
      });
    }
    // Handle edit case
    if (productToEdit) {
      editProduct({
        product: {
          id: productToEdit._id,
          name: productFormData.name,
          price: Number(productFormData.price),
          active: productFormData.active,
        },
      });
    }
    setProductFormData({ name: "", price: "", active: true });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
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
                      When active, this product will be visible to customers and available for ordering. 
                      When inactive, the product will be hidden from the menu but can be reactivated later.
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

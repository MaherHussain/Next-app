import React, { useEffect, useState } from "react";
import { useAddProduct, useEditProduct } from "../../../../queries/products";

interface ProductAddModalProps {
  isOpen: boolean;
  isEditAction?: boolean;
  productToEdit?: {
    _id: string;
    name: string;
    price: number;
  };
  onClose: () => void;
}

const ProductAddModal: React.FC<ProductAddModalProps> = ({
  isOpen,
  onClose,
  isEditAction = false,
  productToEdit,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [productFormData, setProductFormData] = useState<{
    name: string;
    price: number | "";
  }>({ name: "", price: "" });
  const { mutate: addProduct } = useAddProduct();

  const { mutate: editProduct } = useEditProduct();

  useEffect(() => {
    if (isEditAction && productToEdit) {
      setProductFormData({
        name: productToEdit.name || "",
        price: productToEdit.price || "",
      });
    } else {
      setProductFormData({ name: "", price: "" });
    }
  }, [isEditAction, productToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) || "" : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name || productFormData.price === "") return;
    if (!isEditAction) {
      // handle add product
      addProduct({
        name: productFormData.name,
        price: Number(productFormData.price),
      });
    }
    // Handle edit case
    if (productToEdit) {
      editProduct({
        product: {
          id: productToEdit._id,
          name: productFormData.name,
          price: Number(productFormData.price),
        },
      });
    }
    setProductFormData({ name: "", price: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
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

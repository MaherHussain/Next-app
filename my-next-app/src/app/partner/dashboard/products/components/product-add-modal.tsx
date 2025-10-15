import React, { useState } from "react";
import { useAddProduct } from "../../../../queries/products";

interface ProductAddModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProductAddModal: React.FC<ProductAddModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number | "">("");

    const { mutate } = useAddProduct();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || price === "") return;
        mutate({ name, price: Number(price) });
        setName("");
        setPrice("");
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
                            className="w-full border rounded px-3 py-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                            type="number"
                            className="w-full border rounded px-3 py-2"
                            value={price}
                            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
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
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductAddModal;

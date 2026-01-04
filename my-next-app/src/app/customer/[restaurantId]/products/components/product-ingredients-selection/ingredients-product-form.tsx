"use client";
import { useForm } from "react-hook-form";
import { Product } from "@/app/types";
import { useAddToCart } from "@/app/queries/cart";
import { PriceFormatter } from "@/app/utils/helpers/helpers";
import { useEffect, useMemo, useState } from "react";
import { useGetIngredientsGroups } from "@/app/queries/ingredients-groups";
import { useGetAllIngredients } from "@/app/queries/ingredients";
import { QuantitySelector } from "./";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import { useCart } from "@/hooks/useCart";

type FormData = {
  defaultIngredients: string[];
  ingredients: Record<string, string[]>;
  quantity: number;
};

interface IngredientsProductFormProps {
  product: Product;
  onClose: () => void;
}

export default function IngredientsProductForm({
  product,
  onClose,
}: IngredientsProductFormProps) {
  const { data: ingredientsGroupData, isLoading: isGroupsLoading } =
    useGetIngredientsGroups({
      restaurantId: product.restaurantId || "",
    });

  const { data: allIngredientsData, isLoading: isIngredientsLoading } =
    useGetAllIngredients({
      restaurantId: product.restaurantId || "",
    });

  const { handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      defaultIngredients: product.ingredients?.map((ing) => ing._id) || [],
      ingredients: {},
      quantity: 1,
    },
  });

  const quantity = watch("quantity");
  const ingredients = watch("ingredients");
  const defaultIngredients = watch("defaultIngredients");

  function DecreaseQuantity() {
    const currentQuantity = quantity || 1;
    const newQuantity = Math.max(1, currentQuantity - 1);
    setValue("quantity", newQuantity, { shouldValidate: true });
  }

  function IncreaseQuantity() {
    const currentQuantity = quantity || 1;
    const newQuantity = currentQuantity + 1;
    setValue("quantity", newQuantity, { shouldValidate: true });
  }

  // Calculate total cost of selected ingredients
  const selectedIngredientsCost = useMemo(() => {
    if (!ingredients) {
      return 0;
    }

    let totalCost = 0;

    // Loop through all groups from ingredientsGroupData
    if (ingredientsGroupData?.data) {
      ingredientsGroupData.data.forEach((group) => {
        const selectedIds = ingredients[group._id] || [];

        // For each selected ingredient ID, find the ingredient and add its cost
        selectedIds.forEach((ingredientId) => {
          const ingredient = group.ingredients.find(
            (ing) => ing._id === ingredientId
          );
          if (ingredient && ingredient.cost) {
            totalCost += ingredient.cost;
          }
        });
      });
    }

    // Add costs from extra ingredients
    if (allIngredientsData?.data && ingredients["extra-ingredients"]) {
      const extraIngredientIds = ingredients["extra-ingredients"] || [];
      extraIngredientIds.forEach((ingredientId) => {
        const ingredient = allIngredientsData.data.find(
          (ing) => ing._id === ingredientId
        );
        if (ingredient && ingredient.cost) {
          totalCost += ingredient.cost;
        }
      });
    }

    return totalCost;
  }, [ingredientsGroupData?.data, allIngredientsData?.data, ingredients]);

  // Calculate total price: (product price + selected ingredients cost) * quantity
  const totalPrice = useMemo(() => {
    const basePrice = product.price || 0;
    const ingredientsCost = selectedIngredientsCost || 0;
    const totalPerItem = basePrice + ingredientsCost;
    const quantityValue = quantity || 1;

    return totalPerItem * quantityValue;
  }, [product.price, selectedIngredientsCost, quantity]);
  const { cartId } = useCart();
  const { mutate, isSuccess, isError, isPending } = useAddToCart({ cartId });
  const [isExtraIngredientsExpanded, setIsExtraIngredientsExpanded] =
    useState(false);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  }, [isSuccess, onClose]);

  // Handle ingredient toggle
  function handleIngredientToggle(groupId: string, ingredientId: string) {
    const currentGroupIngredients = ingredients[groupId] || [];
    const isSelected = currentGroupIngredients.includes(ingredientId);

    const updatedGroupIngredients = isSelected
      ? currentGroupIngredients.filter((id) => id !== ingredientId)
      : [...currentGroupIngredients, ingredientId];

    setValue("ingredients", {
      ...ingredients,
      [groupId]: updatedGroupIngredients,
    });
  }

  function handleDefaultIngredientToggle(ingredientId: string) {
    const current = watch("defaultIngredients") || [];

    const isSelected = current.includes(ingredientId);
    const updated = isSelected
      ? current.filter((id) => id !== ingredientId)
      : [...current, ingredientId];
    setValue("defaultIngredients", updated);
  }

  const onSubmit = (data: FormData) => {
    const { quantity, ingredients, defaultIngredients } = data;

    // Transform ingredients object to include group name and ingredient data
    const formattedIngredients: Record<string, any[]> = {};

    if (ingredientsGroupData?.data && ingredients) {
      Object.entries(ingredients).forEach(([groupId, ingredientIds]) => {
        // Skip if ingredientIds is empty or not an array
        if (!Array.isArray(ingredientIds) || ingredientIds.length === 0) {
          return; // Skip empty arrays
        }

        // Handle extra ingredients separately
        if (groupId === "extra-ingredients") {
          if (allIngredientsData?.data) {
            const extraIngredients = ingredientIds
              .map((ingId) =>
                allIngredientsData.data.find((ing) => ing._id === ingId)
              )
              .filter(Boolean); //this is same  .filter((item) => item != null)  removes null and undefined

            // Only add if there are ingredients after filtering
            if (extraIngredients.length > 0) {
              formattedIngredients["Extra Ingredients"] = extraIngredients;
            }
          }
        } else {
          const group = ingredientsGroupData.data.find(
            (g) => g._id === groupId
          );
          if (group) {
            const groupIngredients = ingredientIds
              .map((ingId) =>
                group.ingredients.find((ing) => ing._id === ingId)
              )
              .filter(Boolean);

            // Only add if there are ingredients after filtering
            if (groupIngredients.length > 0) {
              formattedIngredients[group.name] = groupIngredients;
            }
          }
        }
      });
    }
    if (product.ingredients && defaultIngredients) {
      const uncheckedDefaults = product.ingredients.filter(
        (ing) => !defaultIngredients.includes(ing._id)
      );

      if (uncheckedDefaults.length > 0) {
        formattedIngredients["Removed Ingredients"] = uncheckedDefaults.map(
          (ing) => ({ ...ing, name: `- ${ing.name}` })
        );
      }
    }

    const payload = {
      product: { name: product.name, id: product._id, price: totalPrice },
      ingredients: formattedIngredients,
      quantity,
    };
    mutate(payload);
    localStorage.setItem("cartId", cartId);
  };

  if (isGroupsLoading || isIngredientsLoading)
    return (
      <div className="h-96 flex justify-center">
        <LoadingSpinner size="large" />
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-[calc(100%-3rem)]"
    >
      <div className=" flex flex-row flex-wrap">
        {product.ingredients &&
          product.ingredients.map((ing) => {
            const isChecked = defaultIngredients.includes(ing._id);

            return (
              <label
                key={ing._id}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    handleDefaultIngredientToggle(ing._id);
                  }}
                  className="appearance-none w-4 h-4 rounded-full border-2 border-gray-300 checked:bg-orange-500 checked:border-orange-500 relative checked:after:content-[''] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:w-2 checked:after:h-2 checked:after:bg-white checked:after:rounded-full accent-orange-500"
                />
                <span
                  className={`text-gray-700 text-sm ${
                    isChecked ? "" : "line-through"
                  }`}
                >
                  {ing.name}
                </span>
              </label>
            );
          })}
      </div>
      <div className="flex flex-row px-4 flex-wrap md:gap-6">
        {ingredientsGroupData?.data.map((group) => (
          <div key={group._id} className="mb-5">
            <h2 className="font-bold pb-2 pt-5 capitalize">{group.name}</h2>
            {group.ingredients.map((item) => {
              const isChecked = (ingredients[group._id] || []).includes(
                item._id
              );
              return (
                <label
                  key={item._id}
                  className="flex items-center capitalize gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleIngredientToggle(group._id, item._id)}
                    className="appearance-none w-4 h-4 rounded-full border-2 border-gray-300 checked:bg-orange-500 checked:border-orange-500 relative checked:after:content-[''] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:w-2 checked:after:h-2 checked:after:bg-white checked:after:rounded-full accent-orange-500"
                  />
                  <span className={`text-gray-700  text-sm `}>
                    {item.name}
                    <span className="text-green-500">
                      {item.cost != 0 ? PriceFormatter(item.cost) : ""}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mb-5 px-4">
        <h2
          className="font-bold pb-2 pt-5 capitalize cursor-pointer flex items-center gap-2"
          onClick={() =>
            setIsExtraIngredientsExpanded(!isExtraIngredientsExpanded)
          }
        >
          extra ingredients
          <span className="text-sm">
            {isExtraIngredientsExpanded ? "▼" : "▶"}
          </span>
        </h2>
        {isExtraIngredientsExpanded && (
          <div className="flex flex-row gap-2 flex-wrap p-3">
            {allIngredientsData?.data && allIngredientsData.data.length > 0 ? (
              allIngredientsData.data.map((ingredient) => {
                const isChecked = ingredients["extra-ingredients"]?.includes(
                  ingredient._id
                );
                return (
                  <label
                    key={ingredient._id}
                    className="flex items-center capitalize gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      value={ingredient._id}
                      checked={isChecked}
                      onChange={() =>
                        handleIngredientToggle(
                          "extra-ingredients",
                          ingredient._id
                        )
                      }
                      className="appearance-none w-4 h-4 rounded-full border-2 border-gray-300 checked:bg-orange-500 checked:border-orange-500 relative checked:after:content-[''] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:w-2 checked:after:h-2 checked:after:bg-white checked:after:rounded-full accent-orange-500"
                    />
                    <span className={`text-gray-700 text-sm`}>
                      {ingredient.name}
                      <span className="text-green-500 ml-2">
                        {ingredient.cost !== 0
                          ? PriceFormatter(ingredient.cost)
                          : ""}
                      </span>
                    </span>
                  </label>
                );
              })
            ) : (
              <div className="text-gray-500 italic">
                No ingredients available.
              </div>
            )}
          </div>
        )}
      </div>

      {/* spacer to push footer to the bottom */}
      <div className="flex-grow" />
      <div className="justify-end">
        <QuantitySelector
          quantity={quantity || 1}
          onDecrease={DecreaseQuantity}
          onIncrease={IncreaseQuantity}
        />

        {isSuccess && <p className="text-green-600">Added!</p>}
        {isError && <p className="text-red-600">Failed to add item.</p>}
        <button
          type="submit"
          disabled={isPending}
          className="bg-orange-700 text-white px-4 py-2 rounded"
        >
          {isPending
            ? "Adding..."
            : ` ${PriceFormatter(totalPrice)}- Add to cart`}
        </button>
      </div>
    </form>
  );
}

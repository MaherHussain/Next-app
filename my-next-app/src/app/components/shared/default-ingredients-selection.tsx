import {useState, useEffect} from 'react'
import { Product } from "@/app/types";
import { CheckboxInput } from '@/app/components/shared';

interface Props {
    product: Product;
    onIngredientsChange?: (selectedIngredients: string[]) => void; // callback function props to pass default ingredient to parent component  
}

function DefaultIngredientsSelection({product, onIngredientsChange}: Props) {

    const [defaultIngredients, setDefaultIngredients] = useState<string[] | null>(null);
    useEffect(() => {
        if(!product) return 
        const initialIngredients = product.ingredients?.map((ing) => ing._id) || [];
        setDefaultIngredients(initialIngredients);
         }, [product]);

  // Notify parent whenever defaultIngredients changes
  useEffect(() => {
    if (defaultIngredients !== null && onIngredientsChange) {
      onIngredientsChange(defaultIngredients);
    }
  }, [defaultIngredients, onIngredientsChange]);

 function handleDefaultIngredientToggle(ingredientId: string) {
   if (!defaultIngredients) return;
   
   const isSelected = defaultIngredients.includes(ingredientId);
   const updated = isSelected
     ? defaultIngredients.filter((id: string) => id !== ingredientId)
     : [...defaultIngredients, ingredientId];
   setDefaultIngredients(updated);
 }

  return (
    <div className=" flex flex-row flex-wrap">
      {product.ingredients &&
        product.ingredients.map((ing) => {
          const isChecked = defaultIngredients?.includes(ing._id) || false;

          return (
            <CheckboxInput
              key={ing._id}
              isChecked={isChecked}
              onChange={() => handleDefaultIngredientToggle(ing._id)}
              label={ing.name}
              showLineThrough
            />
          );
        })}
    </div>
  );
}

export default DefaultIngredientsSelection;

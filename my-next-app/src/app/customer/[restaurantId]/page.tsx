import React from "react";
import ClientProductList from "./ClientProductList";
 async function page({ params }: { params: { restaurantId: string } }) {
  const {restaurantId} = await params
   return (
     <div>
       <ClientProductList restaurantId={restaurantId} />
     </div>
   );
 }
export default page
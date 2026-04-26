import React from "react";
import WidgetClientPage from "@/app/widget/[restaurantId]/WidgetClientPage";

async function Page({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = await params;

  return <WidgetClientPage restaurantId={restaurantId} />;
}

export default Page;

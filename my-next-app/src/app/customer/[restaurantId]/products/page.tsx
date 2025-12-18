import React from 'react'
import ClientProductList from '../ClientProductList'

async function Page({ params }: { params: Promise<{ restaurantId: string }> }) {

  const {restaurantId} = await params
  return (
    <div>
      <h1>Customer Products Page</h1>
      <ClientProductList restaurantId={restaurantId} />
    </div>
  )
}

export default Page
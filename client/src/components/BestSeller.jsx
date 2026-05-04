import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'
import Title from './Title'

const BestSeller = () => {

  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {

    // ✅ FIX: use correct field from DB
    const bestProduct = products.filter((item) => item.isFeatured);

    setBestSeller(bestProduct.slice(0, 5));

  }, [products]);

  return (
    <div className='my-10'>

      {/* TITLE */}
      <div className='text-center text-3xl py-8'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Discover our most popular products loved by customers.
        </p>
      </div>

      {/* PRODUCTS GRID */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>

        {
          bestSeller.length > 0 ? (
            bestSeller.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                image={item.images}   // ✅ correct field
                price={item.price}
              />
            ))
          ) : (
            <p className='text-center col-span-full text-gray-500'>
              No featured products available
            </p>
          )
        }

      </div>

    </div>
  )
}

export default BestSeller
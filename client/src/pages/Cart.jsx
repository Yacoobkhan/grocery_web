import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/Images/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {

    if (products.length > 0) {

      // ✅ Convert object → array safely
      const tempData = Object.keys(cartItems)
        .filter(id => cartItems[id] > 0)
        .map(id => ({
          _id: id,
          quantity: cartItems[id]
        }));

      // ✅ Choose order (recommended: oldest → newest)
      setCartData(tempData);

      // 👉 If you want newest first instead:
      // setCartData(tempData.reverse());
    }

  }, [cartItems, products]);

  return (
    <div className='border-t pt-14'>

      {/* Title */}
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {/* Cart Items */}
      <div>
        {
          cartData.length === 0 ? (
            <p className='text-gray-500'>Your cart is empty</p>
          ) : (
            cartData.map((item, index) => {

              const productData = products.find(
                (product) => product._id === item._id
              );

              // ✅ Prevent crash if product missing
              if (!productData) return null;

              return (
                <div key={index} className='py-4 border flex flex-col md:flex-row md:justify-between md:items-center gap-4'>

                  {/* Product Info */}
                  <div className='flex gap-6 items-center'>

                    <img
                      className='w-16 h-16 object-cover'
                      src={productData.images?.[0] || "https://via.placeholder.com/100"}
                      alt={productData.name}
                    />

                    <div>
                      <p className='font-medium'>{productData.name}</p>
                      <p className='text-gray-600'>
                        {currency}{productData.price}
                      </p>
                    </div>

                  </div>

                  {/* Quantity */}
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item._id, Number(e.target.value))
                    }
                    className='border w-16 px-2 py-1'
                  />

                  {/* Delete */}
                  <img
                    src={assets.bin_icon}
                    className='w-5 cursor-pointer'
                    alt="delete"
                    onClick={() => updateQuantity(item._id, 0)}
                  />

                </div>
              )
            })
          )
        }
      </div>

      {/* Total + Checkout */}
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>

          <CartTotal />

          <div className='text-end'>
            <button
              onClick={() => navigate('/place-order')}
              className='bg-black text-white px-8 py-3 mt-4'
            >
              PROCEED TO CHECKOUT
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Cart;




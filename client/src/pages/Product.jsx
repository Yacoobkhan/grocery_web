import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/Images/assets';
import RelatedProducts from '../components/RelatedProducts';
import { ShopContext } from '../context/ShopContext';

const Product = () => {

  const { productId } = useParams();
  const { products, currency ,addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');

  const fetchProductData = () => {
    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.images?.[0]);
    }
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>

      {/*----------- Product Data-------------- */}
      <div className='flex gap-12 flex-col sm:flex-row'>

        {/*---------- Product Images------------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>

          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18.7%] w-full'>
            {
              productData.images?.map((item,index)=>(
                <img 
                  onClick={()=>setImage(item)} 
                  src={item} 
                  key={index} 
                  className='w-[24%] sm:w-full sm:mb-3 cursor-pointer' 
                  alt="" 
                />
              ))
            }
          </div>

          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>

        </div>

        {/* -------- Product Info ---------- */}
        <div className='flex-1'>

          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>

          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_dull_icon} alt="" className="w-3" />
            <p className='pl-2'>(122)</p>
          </div>

          <p className='mt-5 text-3xl font-medium'>
            {currency}{productData.price}
          </p>

          {/* ✅ Grocery info */}
          <p className='mt-2 text-gray-500'>
            {productData.weight} {productData.unit}
          </p>

          <p className='mt-5 text-gray-500 md:w-4/5'>
            {productData.description}
          </p>

          {/* ✅ Add to cart (no size) */}
          <button 
            onClick={()=>addToCart(productData._id)} 
            className='bg-black text-white px-8 py-3 text-sm mt-6 active:bg-gray-700'
          >
            ADD TO CART
          </button>

          <hr className='mt-8 sm:w-4/5' />

          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Fresh product.</p>
            <p>Cash on delivery available.</p>
            <p>Fast delivery within 24 hours.</p>
          </div>

        </div>
      </div>

      {/* ---------- Description Section ------------- */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
        </div>

        <div className='border px-6 py-6 text-sm text-gray-500'>
          <p>{productData.description}</p>
        </div>
      </div>

      {/* -------- Related Products ---------- */}
      <RelatedProducts 
        category={productData.category} 
        subCategory={productData.subCategory} 
      />

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product;
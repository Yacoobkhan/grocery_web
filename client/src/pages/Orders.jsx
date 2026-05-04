import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {

  const { backendUrl, token , currency } = useContext(ShopContext);
  const [orderData,setorderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`   // ✅ FIX
          }
        }
      );

      if (response.data.success) {
        let allOrdersItem = [];

        response.data.orders.forEach((order)=>{
          order.items.forEach((item)=>{
            item.status = order.status;
            item.payment = order.payment;
            item.paymentMethod = order.paymentMethod;
            item.date = order.createdAt;
            allOrdersItem.push(item);
          })
        });

        setorderData(allOrdersItem);
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    loadOrderData()
  },[token])

  return (
    <div className='border-t pt-16'>

        <div className='text-2xl'>
            <Title text1={'MY'} text2={'ORDERS'}/>
        </div>

        <div>
            {
              orderData.map((item,index) => (
                <div key={index} className='py-4 border-t border-b flex flex-col md:flex-row md:justify-between gap-4'>

                    <div className='flex items-start gap-6 text-sm'>
                        <img className='w-16 sm:w-20' src={item.image || "https://via.placeholder.com/100"}  alt={item.name} /> {/* ✅ FIX */}

                        <div>
                          <p className='font-medium'>{item.name}</p>

                          <p>{currency}{item.price}</p>
                          <p>Quantity: {item.quantity}</p> {/* ✅ NO SIZE */}

                          <p>Date: {new Date(item.date).toDateString()}</p>
                          <p>Payment: {item.paymentMethod}</p>
                        </div>
                    </div>

                    <div className='flex justify-between'>
                        <p className='text-sm'>{item.status}</p>
                        <button onClick={loadOrderData} className='border px-4 py-2 text-sm'>
                          Refresh
                        </button>
                    </div>

                </div>
              ))
            }
        </div>
    </div>
  )
}

export default Orders
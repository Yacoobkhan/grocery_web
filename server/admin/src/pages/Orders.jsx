import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  // ==============================
  // FETCH ALL ORDERS
  // ==============================
  const fetchAllOrders = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    }
  };

  // ==============================
  // UPDATE ORDER STATUS
  // ==============================
  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        {
          orderId,
          status: e.target.value
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Status Updated");
        fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    if (token) fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">All Orders</h3>

      {orders.map((order) => (
        <div
          key={order._id}
          className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_1fr] lg:grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-4 border p-4 mb-4 text-sm rounded"
        >
          {/* ==============================
              PRODUCT IMAGES (ALL)
          ============================== */}
          <div className="flex flex-wrap gap-2">
            {order.items.map((item, i) => (
              <img
                key={i}
                src={item.image}
                className="w-12 h-12 object-cover border rounded"
                alt=""
              />
            ))}
          </div>

          {/* ==============================
              ITEMS + ADDRESS
          ============================== */}
          <div>
            <div>
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <p>
                    {item.name} x {item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-2 font-medium">
              {order.address.fullName}
            </p>

            <p>{order.address.street}</p>
            <p>
              {order.address.city}, {order.address.state},{" "}
              {order.address.pincode}
            </p>

            <p>{order.address.phone}</p>
          </div>

          {/* ==============================
              ORDER INFO
          ============================== */}
          <div>
            <p>Items: {order.items.length}</p>
            <p className="mt-2">Method: {order.paymentMethod}</p>

            <p>
              Payment:{" "}
              {order.paymentStatus === "Completed"
                ? "Done"
                : "Pending"}
            </p>

            <p>
              Date:{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* ==============================
              TOTAL AMOUNT
          ============================== */}
          <div className="font-semibold flex items-center">
            {currency} {order.totalAmount}
          </div>

          {/* ==============================
              STATUS DROPDOWN
          ============================== */}
          <div>
            <select
              onChange={(e) => statusHandler(e, order._id)}
              value={order.status}
              className="p-2 border rounded w-full"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Processing">Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
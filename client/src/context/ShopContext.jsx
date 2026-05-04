import axios from 'axios';
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    const navigate = useNavigate();

    // ==========================
    // ADD TO CART (NO SIZE)
    // ==========================
    const addToCart = async (itemId) => {

        let cartData = structuredClone(cartItems || {});

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(
                    backendUrl + '/api/cart/add',
                    { productId: itemId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    // ==========================
    // UPDATE QUANTITY
    // ==========================
    const updateQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);

        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(
                    backendUrl + '/api/cart/update',
                    { productId: itemId, quantity },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    // ==========================
    // TOTAL CART COUNT
    // ==========================
    const getCartCount = () => {
        let totalCount = 0;

        for (const itemId in cartItems) {
            totalCount += cartItems[itemId];
        }

        return totalCount;
    };

    // ==========================
    // TOTAL CART AMOUNT
    // ==========================
    const getCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItems) {
            const itemInfo = products.find(
                (product) => product._id === itemId
            );

            if (itemInfo) {
                totalAmount += itemInfo.price * cartItems[itemId];
            }
        }

        return totalAmount;
    };

    // ==========================
    // FETCH PRODUCTS
    // ==========================
    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');

            if (response.data.success) {
                setProducts(response.data.products.reverse());
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // ==========================
    // FETCH USER CART
    // ==========================
   const getUserCart = async (token) => {
    try {
        
        const response = await axios.post(
            backendUrl + '/api/cart/get',
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("CART RESPONSE:", response.data);

        if (response.data.success) {

            const cartArray = response.data.cartData;

            let cartObj = {};

            cartArray.forEach(item => {
                cartObj[item.productId._id] = item.quantity;
            });

            setCartItems(cartObj);  // ✅ FIX

        }

    } catch (error) {
        console.log(error);
    }
};

    // ==========================
    // LOAD PRODUCTS
    // ==========================
    useEffect(() => {
        getProductsData();
    }, []);

    // ==========================
    // LOAD CART WHEN TOKEN CHANGES
    // ==========================
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            getUserCart(token);
        }
    }, [token]);

    // ==========================
    // CONTEXT VALUE
    // ==========================
    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        setCartItems,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        setToken,
        token
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
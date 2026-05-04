import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {

  const [images, setImages] = useState([null, null, null, null]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Fruits");
  const [subCategory, setSubCategory] = useState("Fresh");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("kg");
  const [weight, setWeight] = useState("");

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("brand", brand);
      formData.append("stock", stock);
      formData.append("unit", unit);
      formData.append("weight", weight);

      images.forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img);
      });

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ FIXED
          }
        }
      );

      if (response.data.success) {
        toast.success("Product Added");

        // reset form
        setName("");
        setDescription("");
        setPrice("");
        setBrand("");
        setStock("");
        setWeight("");
        setImages([null, null, null, null]);

      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">

      {/* Images */}
      <div>
        <p>Upload Images</p>
        <div className="flex gap-2">
          {images.map((img, i) => (
            <label key={i}>
              <img
                className="w-20"
                src={img ? URL.createObjectURL(img) : assets.upload_area}
                alt=""
              />
              <input
                type="file"
                hidden
                onChange={(e) => handleImageChange(i, e.target.files[0])}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Name */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        required
      />

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />

      {/* Category */}
      <select onChange={(e) => setCategory(e.target.value)}>
        <option>Fruits</option>
        <option>Vegetables</option>
        <option>Dairy</option>
        <option>Snacks</option>
        <option>Beverages</option>
      </select>

      {/* SubCategory */}
      <input
        value={subCategory}
        onChange={(e) => setSubCategory(e.target.value)}
        placeholder="Sub Category"
      />

      {/* Brand */}
      <input
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        placeholder="Brand"
      />

      {/* Price */}
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
      />

      {/* Stock */}
      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Stock"
      />

      {/* Unit */}
      <select onChange={(e) => setUnit(e.target.value)}>
        <option value="kg">kg</option>
        <option value="litre">litre</option>
        <option value="piece">piece</option>
        <option value="pack">pack</option>
      </select>

      {/* Weight */}
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Weight (e.g., 1kg)"
      />

      <button className="bg-black text-white py-2">ADD PRODUCT</button>

    </form>
  );
};

export default Add;
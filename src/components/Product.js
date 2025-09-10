import React, { useState, useEffect } from "react";
import { BASE_URL } from '../constants';
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Product() {
  const [products, setAllProducts] = useState([]);

  async function fetchData() {
    try {
      const productsEndpoint = BASE_URL + "/products/";
      const response = await axios.get(productsEndpoint);      
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="bg-white pt-10">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-2">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="group"
              style={{
                border: "solid 1px #ddd",
                borderRadius: "15px",
                paddingBottom: "26px",
                cursor: "pointer",
              }}
              onClick={(e) => navigate(`/product/${product._id}`)}
            >
              <div
                className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none hover:opacity-75 lg:h-[28rem]"
                style={{ borderRadius: "15px 15px 0 0" }}
              >
                <img
                  src={product.coverImage}
                  alt={product.name}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between px-4">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href='#'>
                      <span aria-hidden="true" className="inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 text-left font-medium">
                    {product.color}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {product.price} {product.currency}
                </p>
              </div>
              <div className="flex  items-center justify-center mx-3">
                <button className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-amber-400 px-10 py-2 text-base font-medium text-black hover:bg-amber-400/75 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2">
                  Add to bag
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Product;

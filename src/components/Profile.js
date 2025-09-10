import React, { useEffect, useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

function OrderContent({ product }) {
  const [imgUrl, setImgUrl] = useState("");

  const fetchData = (productId) => {
    // const BASE_URL = "http://localhost:3800";

    const BASE_URL = "https://nft-ecom-backend.vercel.app";

    const apiUrl = BASE_URL + `/product/details/${productId}`;

    axios
      .get(apiUrl)
      .then((response) => {
        setImgUrl(response.data.imageUrl);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    console.log(product.productId, "erptoert");
    fetchData(product.productId);
  }, [product]);

  return (
    <>
      <div className="rounded-md border-[.5px] border-[#e7e7e7] bg-white p-5 mt-4">
        <div className="items-center sm:flex">
          <div className="mb-3 mr-6 h-20 w-full max-w-[80px] sm:mb-0">
            <img
              src={imgUrl}
              alt="product"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="w-full items-center justify-between md:flex">
            <div className="mb-3 md:mb-0">
              <div className="inline-block text-base font-medium text-black hover:text-primary">
                {product.productName}
              </div>

              <p className="flex text-sm font-medium text-body-color mt-2">
                <span className="mr-5"> Color: {product.color} </span>
                <span className="mr-5"> Size: {product.size} </span>
                <span className="mr-5"> Number: {product.productNumber} </span>
                <span className="mr-5"> NFT Token No: {product?.tokenId} </span>
              </p>
            </div>

            <div className="flex items-center md:justify-end mt-6">
              <p className="mr-20 text-base font-semibold text-black">
                Qty: {product.quantity}
              </p>
              <p className="mr-5 text-base font-semibold text-black">
                ${product.price}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Orders({ order }) {
  const navigate = useNavigate();

  return (
    <div
      className="mb-6 mt-6 bg-[#f9fafa] py-10 "
      style={{ borderRadius: "10px" }}
    >
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 md:w-1/2 lg:w-4/12">
            <div className="mb-6 max-w-[270px]">
              <h4 className="mb-2 text-base font-semibold text-black">
                Date:{" "}
                {order.createdAt &&
                  format(new Date(order?.createdAt), "dd-MM-yyyy")}
              </h4>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-4/12">
            <div
              className="mb-6 max-w-[500px]"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                navigate(`/order/${order._id}`);
              }}
            >
              <h4 className="mb-2 text-base font-semibold text-black">
                OrderId: {order._id}
              </h4>
            </div>
          </div>
        </div>
        {order.orderDetails.productDetails.map((product, index) => (
          <OrderContent key={index} product={product} />
        ))}
      </div>
    </div>
  );
}

function Profile() {
  const address = useAddress();
  const [allOrders, setAllOrders] = useState(null);

  const fetchData = () => {
    // const BASE_URL = "http://localhost:3800";

    const BASE_URL = "https://nft-ecom-backend.vercel.app";

    const apiUrl = BASE_URL + `/order/walletAddress/${address}`;

    axios
      .get(apiUrl)
      .then((response) => {
        // setData(response.data);
        console.log(response.data.data);
        setAllOrders(response.data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (!address) {
      return;
    }

    fetchData();
  }, [address]);

  return (
    <div className="mt-24 px-10">
      {allOrders && allOrders.length === 0 && (
        <div className="my-20 pt-24 flex flex-col">
          <ClipboardDocumentListIcon
            style={{ maxHeight: "250px", textAlign: "center" }}
          />
          <p className="text-3xl pt-10" style={{ textAlign: "center" }}>
            There are no orders yet...
          </p>
        </div>
      )}
      {allOrders &&
        allOrders.map((order) => <Orders key={order._id} order={order} />)}
    </div>
  );
}

export default Profile;

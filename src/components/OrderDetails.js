import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FiMail, FiPhoneCall } from "react-icons/fi";
import { format } from "date-fns";

function OrderCard({ product }) {
  const [imgUrl, setImgUrl] = useState("");

  const fetchData = (productId) => {
    // const BASE_URL = "http://localhost:3800";

    const BASE_URL = "https://nft-ecom-backend.vercel.app";

    const apiUrl = BASE_URL + `/product/details/${productId}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setImgUrl(response.data.imageUrl);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchData(product.productId);
  }, [product]);

  return (
    <>
      <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
        <div className="pb-4 md:pb-8 w-full md:w-40">
          <img
            className="w-full hidden md:block rounded-lg"
            src={imgUrl}
            alt="dress"
          />
          <img className="w-full md:hidden" src={imgUrl} alt="dress" />
        </div>
        <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
          <div className="w-full flex flex-col justify-start items-start space-y-8">
            <h3 className="text-xl  xl:text-2xl font-semibold leading-6 text-gray-800">
              {product.productName}
            </h3>
            <div className="flex justify-start items-start flex-col space-y-2">
              <p className="text-sm  leading-none text-gray-800">
                <span className=" text-gray-500 font-bold">Color: </span>{" "}
                {product.color}
              </p>
              <p className="text-sm  leading-none text-gray-800">
                <span className="text-gray-500 font-bold">Size: </span>{" "}
                {product.size}
              </p>
              <p className="text-sm  leading-none text-gray-800">
                <span className="text-gray-500 font-bold">Product No: </span>{" "}
                {product.productNumber}
              </p>
              <p className="text-sm  leading-none text-gray-800">
                <span className="text-gray-500 font-bold">NFT Token No: </span>{" "}
                {product.tokenId}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-8 items-end w-full">
            <p className="text-base  xl:text-lg font-semibold leading-6 text-gray-800">
              ${product.price}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function OrderDetails() {
  const [order, setAllOrders] = useState(null);

  const { orderId } = useParams();

  const fetchData = () => {
    // const BASE_URL = "http://localhost:3800";

    const BASE_URL = "https://nft-ecom-backend.vercel.app";

    const apiUrl = BASE_URL + `/order/orderId/${orderId}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data.data, "asd");
        setAllOrders(response.data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mt-20">
      <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
        <div className="flex justify-start item-start space-y-2 flex-col">
          <h1 className="text-2xl lg:text-3xl font-semibold leading-7 lg:leading-9 text-gray-800">
            Order {order?._id}
          </h1>

          <h1 className="text-md lg:text-xl font-semibold leading-7 lg:leading-9 text-gray-800">
            Status {order?.orderStatus}
          </h1>
          <p className="text-base font-medium leading-6 text-gray-600">
            {order &&
              order?.createdAt &&
              format(new Date(order?.createdAt), "dd-MM-yyyy")}
          </p>
        </div>
        <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
          <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
            <div className="flex flex-col justify-start items-start  bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full rounded-xl">
              {order?.orderDetails?.productDetails.map((product, idx) => (
                <OrderCard product={product} key={idx} />
              ))}
            </div>

            <div className="flex justify-center flex-col md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
              <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50  rounded-xl space-y-6">
                <h3 className="text-xl  font-semibold leading-5 text-gray-800">
                  Summary
                </h3>
                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                  <div className="flex justify-between w-full">
                    <p className="text-base  leading-4 text-gray-800">
                      Subtotal
                    </p>
                    <p className="text-base  leading-4 text-gray-600">
                      ${order?.orderDetails?.subTotal}
                    </p>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base  leading-4 text-gray-800">Tax</p>
                    <p className="text-base  leading-4 text-gray-600">
                      ${order?.orderDetails?.tax}
                    </p>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base  leading-4 text-gray-800">
                      Shipping
                    </p>
                    <p className="text-base  leading-4 text-gray-600">
                      ${order?.orderDetails?.shippingCharge}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base  font-semibold leading-4 text-gray-800">
                    Total
                  </p>
                  <p className="text-base  font-semibold leading-4 text-gray-600">
                    ${order?.orderDetails?.totalAmount.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50  space-y-6 rounded-xl">
                <h3 className="text-xl  font-semibold leading-5 text-gray-800">
                  Shipping
                </h3>
                <div className="flex justify-between items-start w-full">
                  <div className="flex justify-center items-center space-x-4">
                    <div className="w-8 h-8">
                      <img
                        className="w-full h-full"
                        alt="logo"
                        src="https://i.ibb.co/L8KSdNQ/image-3.png"
                      />
                    </div>

                    <div className="flex flex-col justify-start items-center">
                      <p className="text-lg leading-6  font-semibold text-gray-800">
                        DPD Delivery
                        <br />
                        <span className="font-normal">
                          Delivery with 24 Hours
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold leading-6  text-gray-800">
                    ${order?.orderDetails?.shippingCharge}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50  w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col rounded-xl">
            <h3 className="text-xl  font-semibold leading-5 text-gray-800 mb-4">
              Customer
            </h3>
            <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full border-t md:space-x-6 lg:space-x-8 xl:space-x-0">
              <div className="flex flex-col justify-start items-start flex-shrink-0 ">
                <div className="flex justify-center w-full md:justify-start items-center space-x-4 py-4 border-b border-gray-200  w-full">
                  <div className="flex justify-start items-start flex-col space-y-2">
                    <p className="text-base  font-semibold leading-4 text-left text-gray-800">
                      {order?.customerInfo?.name}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center text-gray-800  md:justify-start items-center space-x-4 py-3 border-b border-gray-200 w-full">
                  <FiMail />
                  <p className="cursor-pointer text-sm leading-5 ">
                    {order?.customerInfo?.email}
                  </p>
                </div>

                <div className="flex justify-center text-gray-800  md:justify-start items-center space-x-4 py-3 border-b border-gray-200 w-full">
                  <FiPhoneCall />
                  <p className="cursor-pointer text-sm leading-5 ">
                    {order?.customerInfo?.phoneNo}
                  </p>
                </div>
              </div>

              <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-6">
                <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                  <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                    <p className="text-base  font-semibold leading-4 text-center md:text-left text-gray-800">
                      Shipping Address
                    </p>
                    <p className="w-48 lg:w-full  xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                      House No : {order?.customerInfo?.shippingAddress?.houseNo}
                    </p>
                    <p className="w-48 lg:w-full  xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                      Street Address :{" "}
                      {order?.customerInfo?.shippingAddress?.streetAddress}
                    </p>
                    <p className="w-48 lg:w-full  xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                      Province :{" "}
                      {order?.customerInfo?.shippingAddress?.province}
                    </p>
                    <p className="w-48 lg:w-full  xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                      Town : {order?.customerInfo?.shippingAddress?.town}
                    </p>
                    <p className="w-48 lg:w-full  xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                      ZIP : {order?.customerInfo?.shippingAddress?.zip}
                    </p>
                  </div>

                  <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                    <p className="text-base  font-semibold leading-4 text-center md:text-left text-gray-800">
                      Payment Details
                    </p>
                    <p className="w-48 lg:w-full  xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                      Payment Method: {order?.paymentInfo?.paymentMethod}
                    </p>
                    <p className="w-48 lg:w-full  xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                      Payment Status : {order?.paymentInfo?.paymentStatus}
                    </p>
                    <p
                      className="w-48 lg:w-full  xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600"
                      style={{ wordBreak: "break-all" }}
                    >
                      Transaction Id : <br />
                      {order?.paymentInfo?.paymentMethod === "ETH"
                        ? order?.paymentInfo?.blockchainTransactionHash
                        : order?.paymentInfo?.transactionId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;

import React, { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BASE_URL } from '../constants';
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import ProductGallery from "./ProductGallery";
import { addToCart } from '../features/cart/cartSlice';
import { useNavigate } from "react-router-dom";


function Describe() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { productId } = useParams();
  const dispatch = useDispatch();

  const handleAddToCart = (
    productId,
    price,
    productName,
    size,
    number,
    color,
    productDisplayImage,
    sku,
    tokenId
  ) => {

    dispatch(
      addToCart({
        productId,
        price,
        productName,
        size,
        number,
        color,
        productDisplayImage,
        sku,
        tokenId,
      })
    );
  };

  const [productDetails, setProductDetails] = useState({
    imageUrls: [],
    videoUrls: [],
    sizes: []
  });
  const [sizes, setSizes] = useState([]);
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [selectedSize, setSelectedSize] = useState();
  const [selectedNumber, setSelectedNumber] = useState();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const isPresentInCart = (size, number, productId) => {
    for (let i = 0; i < cartItems.length; i++) {
      if (
        cartItems[i].size === size &&
        cartItems[i].number === number &&
        productId === cartItems[i].productId
      ) {
        return true;
      }
    }

    return false;
  };

  async function fetchData() {
    try {
      const Url = BASE_URL + `/products/${productId}`;

      const response = await axios.get(Url);
      const value = response.data;

      const sizes = [];
      value.sizes.forEach((item) => {
        sizes.push({
          name: item.size,
          inventoryCount: item.inventoryCount,
          hoodieNumbers: item.hoodieNumbers
          // inStock: item.quantity - item.quantitySold.length > 0,
        });
      });

      // const numberSelectionObj = {};
      // value.sizeQuantityMapping.forEach((item) => {
      //   let arr = [];
      //   for (let i = 1; i <= item.quantity; i++) {
      //     arr.push({
      //       name: i,
      //       inStock:
      //         !item.quantitySold.includes(i) &&
      //         !isPresentInCart(item.size, i, value._id),
      //     });
      //   }
      //   numberSelectionObj[item.size] = arr;
      // });

      // setAvailableNumbers(numberSelectionObj);

      setSizes(sizes);
      setProductDetails(value);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [cartItems]);

  useEffect(() => {
    if (selectedSize) {
      setAvailableNumbers(selectedSize.hoodieNumbers);
    }
  }, [selectedSize])

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto mb-32 max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="mx-auto py-4 flex max-w-2xl items-center space-x-2 lg:max-w-7xl">
              <li>
                <div className="flex items-center">
                  <div className="mr-2 text-sm font-medium text-gray-900 hover:cursor-pointer"
                   onClick={() => navigate('/')}>
                    {productDetails.category}
                  </div>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>

              <li className="text-sm">
                <div
                  aria-current="page"
                  className="font-medium text-gray-500 hover:text-gray-600 hover:cursor-pointer"
                >
                  {productDetails.name}
                </div>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div>
              <ProductGallery imageUrls={productDetails?.imageUrls}/>
            </div>

            {/* Product info */}
            <div className="mx-auto w-full pl-0 pt-10 pb-16 lg:pl-8 lg:pt-0 lg:pb-24">
              <div className=" lg:border-gray-200 lg:pr-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {productDetails?.name}
                </h1>
              </div>

              <div className="pt-10 lg:border-gray-200 lg:pt-6">
                <div>
                  <h3 className="sr-only">Description</h3>
                  <div className="space-y-6">
                    <p className="text-base text-gray-600">
                      {productDetails?.description}
                    </p>
                  </div>
                </div>

                {/* <div className="mt-10">
                  <h3 className="text-sm font-medium text-gray-900">
                    Highlights
                  </h3>

                  <div className="mt-4">
                    <ul
                      role="list"
                      className="list-disc space-y-2 pl-4 text-sm"
                    >
                      {productData?.highlights?.map((highlight) => (
                        <li key={highlight} className="text-gray-400">
                          <span className="text-gray-600">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div> */}

              </div>

              {/* Options */}
              <div className="mt-4 lg:mt-0">
                <h2 className="sr-only">Product information</h2>

                <div>
                  {/* Sizes */}
                  <div className="mt-3">
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-gray-900">
                          Choose a size
                        </h3>
                      </div>

                      <RadioGroup
                        value={selectedSize}
                        onChange={setSelectedSize}
                        className="mt-4"
                      >
                        <RadioGroup.Label className="sr-only">
                          Choose a size
                        </RadioGroup.Label>
                        <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-6">
                          {sizes.map((size) => (
                            <RadioGroup.Option
                              key={size.name}
                              value={size}
                              disabled={size.inventoryCount == 0}
                              className={({ active }) =>
                                classNames(
                                  size.inventoryCount != 0
                                    ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                                    : "cursor-not-allowed bg-gray-50 text-gray-200",
                                  active ? "ring-2 ring-amber-400" : "",
                                  "group relative flex items-center justify-center rounded-md border text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 lg:py-4"
                                )
                              }
                            >
                              {({ active, checked }) => (
                                <>
                                  <RadioGroup.Label as="span">
                                    {size.name}
                                  </RadioGroup.Label>
                                  {size.inventoryCount > 0 ? (
                                    <span
                                      className={classNames(
                                        active ? "border" : "border-2",
                                        checked
                                          ? "border-amber-400"
                                          : "border-transparent",
                                        "pointer-events-none absolute -inset-px rounded-md"
                                      )}
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <span
                                      aria-hidden="true"
                                      className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                    >
                                      <svg
                                        className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        stroke="currentColor"
                                      >
                                        <line
                                          x1={0}
                                          y1={100}
                                          x2={100}
                                          y2={0}
                                          vectorEffect="non-scaling-stroke"
                                        />
                                      </svg>
                                    </span>
                                  )}
                                </>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {selectedSize && (
                      <div className="mt-10">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            Choose a number
                          </h3>
                        </div>

                        <RadioGroup
                          value={selectedNumber}
                          onChange={setSelectedNumber}
                          className="mt-4"
                        >
                          <RadioGroup.Label className="sr-only">
                            Choose a number
                          </RadioGroup.Label>
                          <div className="grid grid-cols-5 gap-4 sm:grid-cols-8 lg:grid-cols-6">
                            {availableNumbers.map((size) => (
                              <RadioGroup.Option
                                key={size}
                                value={size}
                                // disabled={!size.inStock}
                                className={({ active }) =>
                                  classNames(
                                    "cursor-pointer bg-white text-gray-900 shadow-sm",
                                    active ? "ring-2 ring-amber-400" : "",
                                    "group relative flex items-center justify-center rounded-md border py-2 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 lg:py-4"
                                  )
                                }
                              >
                                {({ active, checked }) => (
                                  <>
                                    <RadioGroup.Label as="span">
                                      {size}
                                    </RadioGroup.Label>

                                    <span
                                      className={classNames(
                                        active ? "border" : "border-2",
                                        checked
                                          ? "border-amber-400"
                                          : "border-transparent",
                                        "pointer-events-none absolute -inset-px rounded-md"
                                      )}
                                      aria-hidden="true"
                                    />
                                  </>
                                )}
                              </RadioGroup.Option>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>
                    )}

                  </div>

                  {/* {error && (
                    <p className="mt-4 text-sm text-red-500">
                      Select a size to add to cart
                    </p>
                  )}

                  {notice && (
                    <p className="mt-4 text-sm text-red-500">
                      {productDetails?.title} has been added to your cart.
                    </p>
                  )} */}

                  {/* <Button
                    text="Add to bag"
                    onClick={() => {
                      const id = productData?.id;
                      const image = productData?.image[0];
                      const title = productData?.title;
                      const price = productData?.price;
                      return checkCartItem({
                        id,
                        image,
                        title,
                        price,
                      });
                    }}
                    className="mt-10 flex max-h-[44px] w-full items-center justify-center rounded-md border border-transparent bg-violet-500 py-2 px-8 text-base font-medium leading-7 text-white hover:bg-violet-600"
                  /> */}

                  <p className="mt-6 text-3xl tracking-tight text-gray-900">
                    {productDetails?.price} {productDetails?.currency}
                  </p>

                  <button
                    className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-amber-400 px-8 py-3 text-base font-medium text-black hover:bg-amber-400/75 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                    onClick={(e) => {
                      if (!selectedSize) {
                        toast("Please select a size", {
                          toastId: "error-select-size",
                        });
                        return;
                      }

                      if (!selectedNumber) {
                        toast("Please select a number", {
                          toastId: "error-select-number",
                        });
                        return;
                      }

                      handleAddToCart(
                        productId,
                        productDetails.price,
                        productDetails.productName,
                        selectedSize.name,
                        selectedNumber.name,
                        productDetails.color,
                        productDetails.imageUrls[0],
                        productDetails.sku,
                        productDetails.tokenId
                      );
                      toast("Item Added Successfully!", {
                        toastId: "add-item-to-card-id",
                      });
                    }}
                  >
                    Add to bag
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Describe;

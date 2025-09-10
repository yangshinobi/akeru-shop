import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { removeFromCart, selectCartItems } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Navbar() {
  const dispatch = useDispatch();
  const address = useAddress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const cartItems = useSelector(selectCartItems)
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);

  const handleRemoveFromCart = (productId, size, number) => {
    dispatch(removeFromCart({productId, size, number}));
  };

  useEffect(() => {
    let totalPrice = 0;
    for (const item of cartItems) {
      totalPrice += parseFloat(item.price);
    }

    setTotalPrice(totalPrice);
  }, [cartItems]);

  return (
    <>
      <header
        className="fixed top-0 w-full"
        style={{
          background: "#f6f8f9a1",
          backdropFilter: "blur(18px)",
          zIndex: 10,
        }}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link to="/">
              <div className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img className="h-14 w-auto" src={logo} alt="logo" />
              </div>
            </Link>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            <Link to="/">
              <div className="text-lg font-semibold leading-6 text-gray-900 uppercase">
                Akeru
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center">
            {/* profile */}
            {address && (
              <div className="text-sm font-bold leading-6 text-gray-500 mx-4 cursor-pointer">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="text-sm font-semibold text-gray-500">
                      <UserCircleIcon className="h-7 w-7 mt-2" aria-hidden="true"/>
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/orders"
                              className="text-gray-600 block px-4 py-2 text-sm font-normal"
                            >
                              Orders
                            </Link>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className=" text-gray-600 block px-4 py-2 text-sm font-normal"
                            >
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              // </Link>
            )}

            {/* cart */}
            <div
              className="text-sm font-semibold leading-6 text-gray-500 mx-4 cursor-pointer flex items-center"
              onClick={() => setOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-yellow-600  ring-1 ring-inset ring-yellow-600/50">
                {cartItems.length}
              </span>
            </div>
          </div>

          {/* <div className="ml-4">
            <ConnectWallet theme={"light"} switchToActiveChain={true} />
          </div> */}
        </nav>

        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/">
                <span className="sr-only">Your Company</span>
                <img className="h-8 w-auto" src={logo} alt="" />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Link to="/profile">Profile</Link>
                </div>

                <div className="py-3" onClick={() => setOpen(true)}>
                  Cart
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-50"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-50"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            Shopping cart
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flow-root">
                            <ul className="-my-6 divide-y divide-gray-200">
                              {cartItems.map((product, idx) => (
                                <li key={idx} className="flex py-6">
                                  <div className="h-25 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                      src={product.productDisplayImage}
                                      alt={"productImg"}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <div>{product.productName}</div>
                                        </h3>
                                        <p className="ml-4">
                                          USD {product.price}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        Color: {product.color}
                                      </p>

                                      <p className="mt-1 text-sm text-gray-500">
                                        Size: {product.size}
                                      </p>

                                      <p className="mt-1 text-sm text-gray-500">
                                        Number: {product.number}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm mt-1">
                                      <p className="text-gray-500">
                                        Qty {product.quantity}
                                      </p>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          className="font-medium text-amber-400 hover:text-amber-400"
                                          onClick={(e) => {
                                            handleRemoveFromCart(
                                              product.productId,
                                              product.size,
                                              product.number
                                            );
                                          }}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>${totalPrice}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className="mt-6">
                          <button
                            className="flex items-center justify-center rounded-md border border-transparent bg-amber-400 px-6 py-3 text-base font-medium text-black shadow-sm hover:bg-amber-400/75 w-full"
                            onClick={(e) => {
                              // if (!address) {
                              //   toast("Connect your wallet to checkout", {
                              //     toastId: "Checkout Button",
                              //   });

                              //   return;
                              // }

                              if (cartItems.length <= 0) {
                                toast("No items in cart", {
                                  toastId: "Checkout Button",
                                });
                                return;
                              }

                              setOpen(false);
                              navigate("/checkoutWithCard");
                            }}
                          >
                            Checkout
                          </button>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

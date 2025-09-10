import React, { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useAddress } from "@thirdweb-dev/react";
import axios from "axios";
import { toast } from "react-toastify";
import img from "../assets/unicorn.svg";

function ProfileDetails() {
  // const BASE_URL = "http://localhost:3800";

  const BASE_URL = "https://nft-ecom-backend.vercel.app";

  const address = useAddress();
  const [isEdit, setIsEditMode] = useState(false);
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchData = (address) => {
    const apiUrl = BASE_URL + `/profile/${address}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        if (response.data.data.length > 0) {
          setUserName(response.data.data[0].userName);
          setDescription(response.data.data[0].description);
          setName(response.data.data[0].fullName);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchData(address);
  }, [address]);

  const updateProfile = () => {
    const apiUrl = BASE_URL + `/profile/${address}`;

    if (userName === "" || name === "") {
      return;
    }

    const data = {
      userName: userName,
      fullName: name,
      description: description,
    };

    axios
      .post(apiUrl, data)
      .then((response) => {
        console.log(response.data);
        if (response.data.status === 200) {
          toast("Profile Updated successfully..", {
            toastId: "profile-update",
          });
        }
        setIsEditMode(false);
      })
      .catch((error) => {
        toast("Some Error Occured..", {
          toastId: "profile-update",
        });
        console.error("Error:", error);
      });
  };

  return (
    <div className="mt-24 mb-20">
      <div className="mx-auto max-w-screen-md pt-20">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4 flex justify-center">
                {/* <div className="relative"> */}
                <img
                  alt="profileImg"
                  src={img}
                  className="shadow-xl rounded-full h-24 align-middle border-none absolute -m-6 -ml-0 lg:-ml-0 max-w-100-px"
                />
                {/* </div> */}
              </div>
            </div>
            <div className="text-center mt-20">
              <div className="my-4 pt-10">
                <label className="mt-4 mb-2 block text-sm font-medium">
                  Wallet Address
                </label>
                <input
                  type="text"
                  id="wallet-address"
                  name="wallet address"
                  className="w-8/12 rounded-md border border-gray-200 text-gray-700 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="WalletAddress"
                  required
                  disabled
                  value={address}
                />
              </div>
              <div className="my-4 pt-2">
                <label className="mt-4 mb-2 block text-sm font-medium ">
                  User Name
                </label>
                <input
                  type="text"
                  id="username"
                  name="User Name"
                  className="w-8/12 rounded-md border text-gray-700 border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="@...."
                  required
                  disabled={!isEdit}
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
              </div>

              <div className="my-4 pt-2">
                <label className="mt-4 mb-2 block text-sm font-medium ">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullName"
                  className="w-8/12 rounded-md border border-gray-200 text-gray-700 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Full Name"
                  required
                  disabled={!isEdit}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="mt-2 py-8 border-t border-blueGray-200 text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-9/12 px-4">
                  <div className="my-4 ">
                    <label className="mt-4 mb-2 block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      type="text"
                      id="description"
                      name="description"
                      className="w-full rounded-md border text-gray-700 border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Description"
                      required
                      multiline
                      rows={4}
                      maxRows={10}
                      disabled={!isEdit}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                  </div>
                  {isEdit ? (
                    <div className="flex">
                      <div
                        className="font-normal text-white bg-red-500 flex items-center  rounded-md justify-center mx-2"
                        style={{ cursor: "pointer", minWidth: "200px" }}
                        onClick={(e) => setIsEditMode(false)}
                      >
                        <div className="flex items-center justify-center  px-3 py-3 w-6/12 font-bold">
                          Cancel
                        </div>
                      </div>

                      <div
                        className="font-normal text-white bg-green-500 flex rounded-md items-center justify-center mx-2"
                        style={{ cursor: "pointer", minWidth: "200px" }}
                        onClick={(e) => {
                          updateProfile();
                        }}
                      >
                        <div className="flex items-center justify-center  px-3 py-3 w-6/12 font-bold">
                          Save
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="font-normal text-white bg-amber-500 flex items-center rounded-md justify-center"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => setIsEditMode(true)}
                      >
                        <div className="flex items-center justify-center px-3 py-3 w-6/12 font-bold">
                          <PencilIcon className="h-4 w-4 mr-2 font-bold" />
                          Edit
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;

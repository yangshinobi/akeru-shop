import React, { useState } from "react";
import logo from "../assets/akeru_logo.gif";
import axios from "axios";
import { toast } from "react-toastify";

function Comingsoon() {
    // const BASE_URL = "http://localhost:3800";

    const BASE_URL = "https://nft-ecom-backend.vercel.app";

    const [email, setemail] = useState("");

    const storeEmail = async (e) => {
        const apiUrl = BASE_URL + `/email/add-email`;

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === "" || !regex.test(email)) {
            return;
        }

        let payload = {
            "emailId": email
        }

        await axios.post(apiUrl, payload).then((response) => {
            if (response.data.status === 200) {
                setemail("");
                toast("Email Sent Successfully", {
                    toastId: "PaymentUpdateSuccess",
                });
            }
            else {
                toast("Some Error Occurred", {
                    toastId: "PaymentUpdateSuccess",
                });
            }

            // console.log(response);
        })
            .catch((error) => {
                toast("Some Error Occurred", {
                    toastId: "PaymentUpdateSuccess",
                });
                console.error("Error:", error);
            });
    }


    return (
        <div className="relative h-full lg:h-screen p-10 2xl:h-screen flex flex-col items-center justify-center bg-fixed bg-no-repeat bg-center bg-cover bg-white" id="home">
            <div className="container">

                <div className="grid lg:grid-cols-2 gap-20">
                    <div className="flex flex-wrap items-center justify-center text-3xl text-white uppercase font-bold tracking-wider">
                        <img className="" src="https://zoyothemes.com/tailwind/cotido/assets/images/business.jpg" />
                    </div>

                    <div className="flex-wrap flex items-center md: justify-center justify-start md:gap-0 gap-10">
                        <div>
                            <img className="h-25 w-auto" src={logo} alt="logo" />
                        </div>
                        <div className="mt-4">
                            <h1 className="text-3xl md:text-5xl/tight text-dark tracking-normal leading-normal font-bold md:text-center text-center">We're on the verge of our upcoming launch!</h1>
                        </div>
                        <div className="mx-auto  w-full lg:w-[80%] px-4 pb-6 sm:px-6 border-gray-100 text-center mt-10">
                            <div className="mx-auto">
                                <div className="relative max-w-2xl">
                                    <label className="sr-only"> Email </label>
                                    <input
                                        className="w-full border-gray-200 bg-gray-100 p-4 pe-32 text-sm font-medium focus:outline-none rounded-md"
                                        id="email"
                                        type="email"
                                        placeholder="Enter your Email"
                                        value={email}
                                        onChange={(e) => {
                                            setemail(e.target.value);
                                        }}
                                    />

                                    <button onClick={(e) => storeEmail()} className="absolute end-0 top-1/2 -translate-y-1/2 bg-amber-500 px-6 rounded-md h-full text-sm font-medium text-white transition hover:bg-amber-400">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>

    );
}

export default Comingsoon;
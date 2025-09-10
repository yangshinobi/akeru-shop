import React, { useState } from "react";
import { BASE_URL } from '../constants';
import axios from "axios";

function Footer() {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      const response = await axios.post(`${BASE_URL}/mailinglist/subscribe`, {
        email,
      });

      if (response.status === 200) {
        setStatusMessage("Subscribed successfully! 🎉");
        setEmail("");
      } else {
        setStatusMessage(response.data.message || "Failed to subscribe.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again later.";
      setStatusMessage(errorMessage);
    }
  };

  return (
    <footer className="bg-white pb-10" >
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="mx-auto max-w-md">
          <strong className="block text-center text-md font-bold text-gray-900 sm:text-2xl">
            Want us to email you with the latest blockbuster news?
          </strong>

          <form className="mt-6" onSubmit={handleSubscribe}>
            <div className="relative max-w-lg">
              <label className="sr-only" htmlFor="email">
                Email
              </label>

              <input
                className="w-full rounded-full border-gray-200 bg-gray-100 p-4 pe-32 text-sm font-medium focus:outline-none"
                id="email"
                type="email"
                placeholder="john@doe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                className="absolute end-1 top-1/2 -translate-y-1/2 rounded-full bg-amber-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-amber-400"
              >
                Subscribe
              </button>
            </div>
          </form>

          {statusMessage && (
            <p className="mt-2 text-center text-sm text-gray-700">
              {statusMessage}
            </p>
          )}
        </div>

        <div className="mt-6 pt-6 sm:flex sm:items-center sm:justify-center">
          <p className="text-center text-sm text-gray-500 sm:text-left">
            Copyright &copy; {new Date().getFullYear()}. All rights reserved.
          </p>

          {/* <ul className="mt-4 flex justify-center gap-6 sm:mt-0 sm:justify-start">
            <li>
              <a
                href="/"
                rel="noreferrer"
                target="_blank"
                className="text-amber-500 transition hover:text-amber-500/75"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ul> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;

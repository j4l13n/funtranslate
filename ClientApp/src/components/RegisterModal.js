import React, { useState } from "react";

const RegisterModal = ({ onSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    // You can perform any logic you want with the input values here
    onSubmit(email, password);
    // Clear the input fields
    setEmail("");
    setPassword("");
    // Close the modal
    closeModal();
  };

  return (
    <>
      <button onClick={openModal} className="border-2 bg-white py-2 px-4 text-black rounded-sm hover:bg-green-700">
        Register
      </button>
      <div
        className={`${
            isModalOpen ? "block" : "hidden"
        } fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-50 flex justify-center items-center`}
      >
        <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Register</h2>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 w-full border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 w-full border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterModal;

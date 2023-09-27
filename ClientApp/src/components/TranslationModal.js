import React, { useState } from 'react';

const TranslationModal = ({ isOpen, onClose, onSubmit }) => {
  const [originalText, setOriginalText] = useState('');
  const [translationStyle, setTranslationStyle] = useState('leetspeak');

  const handleSubmit = () => {
    // You can perform any logic you want with the input values here
    onSubmit(originalText, translationStyle);
    // Clear the input fields
    setOriginalText('');
    // Close the modal
    onClose();
  };

  return (
    <div
      className={`${
        isOpen ? 'block' : 'hidden'
      } fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-50 flex justify-center items-center`}
    >
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Text Fun Translation</h2>
        <div className="mb-4">
          <label htmlFor="originalText" className="block text-sm font-medium text-gray-700">
            Original Text
          </label>
          <input
            type="text"
            id="originalText"
            className="mt-1 p-2 w-full border rounded-md"
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="translationStyle" className="block text-sm font-medium text-gray-700">
            Translation Style
          </label>
          <select
            id="translationStyle"
            className="mt-1 p-2 w-full border rounded-md"
            value={translationStyle}
            onChange={(e) => setTranslationStyle(e.target.value)}
          >
            <option value="leetspeak">Leetspeak</option>
            <option value="yoda">Yoda</option>
            <option value="minion">Minion</option>
            {/* Add more translation style options here */}
          </select>
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
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslationModal;

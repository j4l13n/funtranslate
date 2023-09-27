import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@apollo/client";
import axios from 'axios';
import { RECORDS } from "../gql/record";
import TranslationModal from "./TranslationModal";

export function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (originalText, translationText) => {
    // Handle the submitted data as needed (e.g., send it to a server)
    console.log("Original Text:", originalText);
    console.log("Translation Text:", translationText);
    try {
      const response = await axios.get('https://localhost:7281/FunTranslate/translate', {
        params: {
          text: originalText,
          targetLanguage: translationText,
        },
      });

      // Assuming the server responds with the translated text
      // setTranslatedText(response.data.translatedText);
      console.log(response)
    } catch (err) {
      // setError('An error occurred while translating.');
      console.error(err);
    }
  };

  const { data: records } = useQuery(RECORDS);

  const rows = [];

  for (let record in records?.records) {
    rows.push({
      id: records?.records[record]?.id,
      originalText: records?.records[record]?.inputText,
      translatedText: records?.records[record]?.funText,
      userId: records?.records[record]?.userId,
    });
  }

  const columns = [
    { field: "originalText", headerName: "Original Text", width: 150 },
    { field: "translatedText", headerName: "Translated Text", width: 150 },
    { field: "userId", headerName: "User ID", width: 150 },
  ];

  return (
    <div className="text-lg text-green-500">
      <div className="py-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600"
          onClick={openModal}
        >
          Translate Text
        </button>
        <TranslationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      </div>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

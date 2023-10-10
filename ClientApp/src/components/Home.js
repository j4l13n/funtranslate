import React, { useContext, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery, useMutation } from "@apollo/client";
// import axios from 'axios';
import { RECORDS, ADD_RECORD } from "../gql/record";
import TranslationModal from "./TranslationModal";
import toast from "react-hot-toast";
import { AuthContext } from "../App";

export function Home() {
  const {userId} = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [addRecord] = useMutation(ADD_RECORD, {
    onCompleted: data => {
      if (data?.addRecord?.success) {
        toast.success(data?.addRecord?.message);
      }
    },
    onError: error => {
      if (error?.graphQLErrors && error?.graphQLErrors[0]?.message.length) {
        toast.error(error?.graphQLErrors[0]?.message);
      } else {
        toast.error("Unexpected error occurred, refresh this current page");
      }
    }
  })

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMutationSubmit = (originalText, translatedStyle) => {
    if (!userId) {
      toast.error('You will need to login to perform this action!')
    } else {
      addRecord({variables: {
        originalText,
        targetLanguage: translatedStyle,
        userId: Number(userId)
      }})
    }
    
  }

  // const handleSubmit = async (originalText, translationText) => {
  //   // Handle the submitted data as needed (e.g., send it to a server) using axios
  //   try {
  //     const response = await axios.get('https://localhost:7281/FunTranslate/translate', {
  //       params: {
  //         text: originalText,
  //         targetLanguage: translationText,
  //       },
  //     });

  //     // Assuming the server responds with the translated text
  //     // setTranslatedText(response.data.translatedText);
  //     console.log(response)
  //   } catch (err) {
  //     // setError('An error occurred while translating.');
  //     console.error(err);
  //   }
  // };

  const { data: records } = useQuery(RECORDS, {
    pollInterval: 5000
  });

  const rows = [];

  for (let record in records?.records?.records) {
    rows.push({
      id: records?.records?.records[record]?.id,
      originalText: records?.records?.records[record]?.inputText,
      translatedText: records?.records?.records[record]?.funText,
      userId: records?.records?.records[record]?.userId,
      translationStyle: records?.records?.records[record]?.targetLanguage,
    });
  }

  const columns = [
    { field: "userId", headerName: "User ID", width: 150 },
    { field: "originalText", headerName: "Original Text", width: 150 },
    { field: "translatedText", headerName: "Translated Text", width: 150 },
    { field: "translationStyle", headerName: "Translation Style", width: 150 },
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
          onSubmit={handleMutationSubmit}
        />
      </div>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

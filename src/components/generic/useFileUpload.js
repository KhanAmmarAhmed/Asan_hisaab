import { useState, useRef } from "react";
import { fileToBase64 } from "./modalHelpers";

export const useFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState(null);
  const inputRef = useRef(null);

  // Validate file - reject PDF files
  const validateFile = (file) => {
    if (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    ) {
      setFileError(
        "PDF files are not allowed. Please upload a different file type.",
      );
      return false;
    }
    setFileError(null);
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError(null);
  };

  const getFileData = async () => {
    if (!selectedFile) return null;
    try {
      const base64 = await fileToBase64(selectedFile);
      return {
        name: selectedFile.name,
        type: selectedFile.type,
        data: base64,
      };
    } catch (error) {
      console.error("Error converting file to base64:", error);
      return selectedFile;
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setDragActive(false);
    setFileError(null);
  };

  return {
    selectedFile,
    dragActive,
    fileError,
    inputRef,
    handleDrag,
    handleDrop,
    handleFileChange,
    onButtonClick,
    removeFile,
    getFileData,
    reset,
  };
};

// Utility functions for modal components

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "#4CAF50";
    case "pending":
      return "#FF9800";
    case "invoiced":
      return "#2196F3";
    default:
      return "#9E9E9E";
  }
};

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// import { useState } from "react";

// export const useItemsManagement = (initialItems = []) => {
//   const [newItem, setNewItem] = useState({
//     itemName: "",
//     quantity: 1,
//     price: 0,
//   });

//   const addItem = (formData, setFormData) => {
//     if (!newItem.itemName) return;
//     const items = formData.items || [];
//     const total = newItem.quantity * newItem.price;
//     const itemWithTotal = { ...newItem, total, id: Date.now() };
//     setFormData((prev) => ({
//       ...prev,
//       items: [...items, itemWithTotal],
//     }));
//     setNewItem({ itemName: "", quantity: 1, price: 0 });
//   };

//   const removeItem = (itemId, formData, setFormData) => {
//     setFormData((prev) => ({
//       ...prev,
//       items: (prev.items || []).filter((item) => item.id !== itemId),
//     }));
//   };

//   const updateItem = (itemId, updates, formData, setFormData) => {
//     setFormData((prev) => ({
//       ...prev,
//       items: (prev.items || []).map((item) =>
//         item.id === itemId ? { ...item, ...updates } : item,
//       ),
//     }));
//   };

//   const getItemsTotal = (items = []) => {
//     return items.reduce((sum, item) => sum + (item.total || 0), 0);
//   };

//   const resetNewItem = () => {
//     setNewItem({ itemName: "", quantity: 1, price: 0 });
//   };

//   return {
//     newItem,
//     setNewItem,
//     addItem,
//     removeItem,
//     updateItem,
//     getItemsTotal,
//     resetNewItem,
//   };
// };

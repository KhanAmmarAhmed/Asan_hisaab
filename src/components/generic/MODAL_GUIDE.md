# Modular Modal Components Guide

This guide explains how to use the new split modal components instead of the monolithic GenericModal.

## Components Overview

### 1. **FormModal** - For Add/Edit/Form Operations

The most commonly used modal for CRUD operations.

**Usage in DepartmentsPage:**

```jsx
import FormModal from "../../generic/FormModal";

const DepartmentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const departmentFields = useMemo(
    () => [
      {
        id: "departmentName",
        label: "Department Name",
        type: "text",
        placeholder: "Enter department name",
        required: true,
      },
    ],
    [],
  );

  return (
    <>
      {/* Add Modal */}
      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode="add"
        title="Add Department"
        fields={departmentFields}
        submitButtonLabel="Add"
        onSubmit={handleAddDepartment}
        loading={loading}
        error={error}
      />

      {/* Edit Modal */}
      <FormModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        mode="edit"
        selectedRow={editingDept}
        title="Edit Department"
        fields={departmentFields}
        submitButtonLabel="Update"
        onSubmit={handleEditDepartment}
        loading={loading}
        error={error}
      />
    </>
  );
};
```

### 2. **FormField** - For Individual Field Rendering

Used internally by FormModal, but can be used separately if needed.

**Supported Field Types:**

- `text` - Text input
- `textarea` - Multi-line text
- `select` - Dropdown select (with `options` array)
- `select` with `optionsWithImages` - Select with images/icons

**Field Configuration:**

```javascript
{
  id: "fieldName",
  label: "Display Label",
  type: "text", // text, textarea, select, etc.
  placeholder: "Help text",
  required: true,
  defaultValue: "initial value",
  fullWidth: true,
  // For select fields:
  options: [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
  ],
}
```

### 3. **FileUploadSection** - For File Uploads

Can be included inside FormModal with `showFileUpload` prop.

```jsx
<FormModal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Upload Document"
  fields={fields}
  showFileUpload={true}
  onSubmit={handleSubmit}
/>
```

### 4. **Utility Hooks**

#### useFileUpload()

Manages file upload state and operations.

```javascript
const fileUpload = useFileUpload();

// Access:
const { selectedFile, dragActive, handleDrag, handleDrop, getFileData } =
  fileUpload;

// Get file data:
const fileData = await fileUpload.getFileData();
```

#### useItemsManagement()

Manages line items for invoices, expenses, etc.

```javascript
const items = useItemsManagement();

// Add item:
items.addItem(formData, setFormData);

// Remove item by ID:
items.removeItem(itemId, formData, setFormData);

// Get total:
const total = items.getItemsTotal(formData.items);
```

## Migration Guide

### From GenericModal to FormModal

**Before:**

```jsx
import GenericModal from "../../generic/GenericModal";

<GenericModal
  open={isOpen}
  onOpenChange={setIsOpen}
  mode="edit"
  selectedRow={selectedRow}
  fields={fields}
  onSubmit={handleSubmit}
  title="Edit Item"
/>;
```

**After:**

```jsx
import FormModal from "../../generic/FormModal";

<FormModal
  open={isOpen}
  onOpenChange={setIsOpen}
  mode="edit"
  selectedRow={selectedRow}
  fields={fields}
  onSubmit={handleSubmit}
  title="Edit Item"
/>;
```

## Files Structure

```
src/components/generic/
├── FormModal.jsx              # Main form modal (add/edit/form)
├── FileUploadSection.jsx      # File upload UI component
├── FormField.jsx              # Individual field renderer
├── useFileUpload.js           # File upload logic hook
├── useItemsManagement.js      # Items management hook
├── modalHelpers.js            # Utility functions
├── GenericSelectField.jsx     # Existing (used by FormField)
├── GenericDateField.jsx       # Existing (used by FormField)
└── GenericModal.jsx           # Legacy (deprecated)
```

## Benefits of Modular Approach

1. **Smaller Components** - Easier to understand and maintain
2. **Better Performance** - Only loads what's needed
3. **Reusable Hooks** - File upload and items logic can be used anywhere
4. **Type-Safe** - Easier to add TypeScript support
5. **Testing** - Smaller components are easier to test
6. **Flexibility** - Mix and match components as needed

## Notes

- FormModal handles add/form/edit modes
- For complex workflows (payable, receivable), create specialized modals
- All form state is isolated within each modal instance
- The `hasInitialized` flag prevents form resets during editing

const isNonEmptyValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
};

const pickFirstValue = (...values) =>
  values.find((value) => isNonEmptyValue(value));

const toIsoDate = (value) => {
  const rawValue = pickFirstValue(value);
  if (!rawValue) return "";

  const normalizedValue =
    typeof rawValue === "string" && rawValue.includes(" ") && !rawValue.includes("T")
      ? rawValue.replace(" ", "T")
      : rawValue;

  const parsedDate = new Date(normalizedValue);
  if (Number.isNaN(parsedDate.getTime())) {
    const dateMatch = String(rawValue).match(/\d{4}-\d{2}-\d{2}/);
    return dateMatch?.[0] || "";
  }

  return parsedDate.toISOString().split("T")[0];
};

export const normalizeEmployeeRecord = (item = {}, fallback = {}) => {
  const source = item && typeof item === "object" ? item : {};
  const fallbackSource =
    fallback && typeof fallback === "object" ? fallback : {};

  const employee =
    source.employee && typeof source.employee === "object"
      ? source.employee
      : source;
  const fallbackEmployee =
    fallbackSource.employee && typeof fallbackSource.employee === "object"
      ? fallbackSource.employee
      : fallbackSource;

  const department =
    source.department && typeof source.department === "object"
      ? source.department
      : {};
  const designation =
    source.designation && typeof source.designation === "object"
      ? source.designation
      : {};

  return {
    id: pickFirstValue(
      employee.id,
      employee.employee_id,
      employee.employeeId,
      source.id,
      source.employee_id,
      source.employeeId,
      fallbackEmployee.id,
      fallbackEmployee.employee_id,
      fallbackEmployee.employeeId,
      fallbackSource.id,
    ),
    name: pickFirstValue(
      employee.name,
      employee.employee_name,
      employee.employeeName,
      source.name,
      source.employee_name,
      source.employeeName,
      fallbackEmployee.name,
      fallbackEmployee.employee_name,
      fallbackEmployee.employeeName,
      fallbackSource.name,
      fallbackSource.employeeName,
      "",
    ),
    number: pickFirstValue(
      employee.number,
      employee.phone,
      source.number,
      source.phone,
      fallbackEmployee.number,
      fallbackEmployee.phone,
      fallbackSource.number,
      fallbackSource.phone,
      "",
    ),
    email: pickFirstValue(
      employee.email,
      source.email,
      fallbackEmployee.email,
      fallbackSource.email,
      "",
    ),
    address: pickFirstValue(
      employee.address,
      employee.Address,
      source.address,
      source.Address,
      fallbackEmployee.address,
      fallbackEmployee.Address,
      fallbackSource.address,
      fallbackSource.Address,
      "",
    ),
    department: pickFirstValue(
      department.department_name,
      department.name,
      employee.department_name,
      employee.department,
      source.department_name,
      source.department,
      fallbackSource.department,
      fallbackSource.department_name,
      "",
    ),
    designation: pickFirstValue(
      designation.designation_name,
      designation.name,
      employee.designation_name,
      employee.designation,
      source.designation_name,
      source.designation,
      fallbackSource.designation,
      fallbackSource.designation_name,
      "",
    ),
    department_id: pickFirstValue(
      department.id,
      department.department_id,
      employee.department_id,
      employee.departments_id,
      source.department_id,
      source.departments_id,
      fallbackSource.department_id,
      "",
    ),
    designation_id: pickFirstValue(
      designation.id,
      designation.designation_id,
      employee.designation_id,
      employee.designations_id,
      source.designation_id,
      source.designations_id,
      fallbackSource.designation_id,
      "",
    ),
    created_at: pickFirstValue(
      employee.created_at,
      employee.createdAt,
      employee.date,
      source.created_at,
      source.createdAt,
      source.date,
      fallbackEmployee.created_at,
      fallbackEmployee.createdAt,
      fallbackEmployee.date,
      fallbackSource.created_at,
      fallbackSource.date,
      "",
    ),
  };
};

export const mapEmployeeToRow = (item = {}, fallback = {}) => {
  const normalizedEmployee = normalizeEmployeeRecord(item, fallback);

  return {
    id: normalizedEmployee.id,
    employeeName: normalizedEmployee.name,
    phone: normalizedEmployee.number,
    email: normalizedEmployee.email,
    address: normalizedEmployee.address,
    department: normalizedEmployee.department,
    designation: normalizedEmployee.designation,
    department_id: normalizedEmployee.department_id,
    designation_id: normalizedEmployee.designation_id,
    date: toIsoDate(normalizedEmployee.created_at),
  };
};

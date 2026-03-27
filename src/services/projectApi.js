import apiClient, { isApiError } from "./apiClient";

const assertApiSuccess = (payload, fallbackMessage) => {
  if (typeof payload?.success === "boolean") {
    if (!payload.success) {
      const errorMessage =
        payload?.message || payload?.error || fallbackMessage;
      throw new Error(errorMessage);
    }
    return;
  }

  const status = String(payload?.status ?? "")
    .trim()
    .toLowerCase();

  if (status && status !== "success") {
    const errorMessage = payload?.message || payload?.error || fallbackMessage;
    throw new Error(errorMessage);
  }
};

export const fetchProjectsApi = async () => {
  try {
    const formData = new FormData();
    formData.append("action", "get");
    const res = await apiClient.post("/projects_api.php", formData);
    const payload = res?.data ?? {};

    if (payload?.data && Array.isArray(payload.data)) {
      return payload.data;
    } else if (payload?.projects && Array.isArray(payload.projects)) {
      return payload.projects;
    } else if (Array.isArray(payload)) {
      return payload;
    }
    return [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const addProjectApi = async (projectData) => {
  const formData = new FormData();
  formData.append("action", "add");
  formData.append("name", projectData?.name || "");
  formData.append("alias", projectData?.alias || "");
  formData.append("type", projectData?.type || "");

  const res = await apiClient.post("/projects_api.php", formData);
  const payload = res?.data ?? {};
  assertApiSuccess(payload, "Failed to create project");
  return payload?.data ?? payload;
};

export const updateProjectApi = async (projectData) => {
  const formData = new FormData();
  formData.append("action", "update");
  formData.append("id", projectData?.id || "");
  formData.append("name", projectData?.name || "");
  formData.append("alias", projectData?.alias || "");
  formData.append("type", projectData?.type || "");

  const res = await apiClient.post("/projects_api.php", formData);
  const payload = res?.data ?? {};
  assertApiSuccess(payload, "Failed to update project");
  return payload?.data ?? payload;
};

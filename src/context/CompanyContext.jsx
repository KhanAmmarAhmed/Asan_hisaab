import React, { createContext, useState, useEffect } from "react";

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState(() => {
    const saved = localStorage.getItem("companyInfo");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Friends It Solutions",
          type: "FIS - IT Company",
        };
  });

  useEffect(() => {
    localStorage.setItem("companyInfo", JSON.stringify(companyInfo));
  }, [companyInfo]);

  return (
    <CompanyContext.Provider value={{ companyInfo, setCompanyInfo }}>
      {children}
    </CompanyContext.Provider>
  );
};

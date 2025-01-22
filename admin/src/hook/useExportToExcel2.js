import { useCallback } from "react";
import * as XLSX from "xlsx";

const useExportToExcel2 = () => {
  const exportToExcel = useCallback((sheets, fileName = "exported_data") => {
    const workbook = XLSX.utils.book_new();

    sheets.forEach(({ data, columns, sheetName }) => {
      const sheetData = data.map((row) => {
        const formattedRow = {};
        columns.forEach((col) => {
          const { dataIndex, title, render } = col;

          // Use render function if it exists, otherwise map raw data
          formattedRow[title] =
            render && typeof render === "function"
              ? render(row[dataIndex], row)
              : row[dataIndex];
        });
        return formattedRow;
      });

      const worksheet = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }, []);

  return exportToExcel;
};

export default useExportToExcel2;

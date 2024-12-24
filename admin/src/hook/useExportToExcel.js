import { useCallback } from "react";
import * as XLSX from "xlsx";

const useExportToExcel = (
  data,
  columns,
  expandedRowData = [],
  fileName = "exported_data"
) => {
  const exportToExcel = useCallback(() => {
    // Combine the main data and expanded row data
    const combinedData = data.map((item) => {
      const expandedData = expandedRowData[item.key] || []; // Get expanded data for the row if it exists
      return {
        ...item,
        expandedData, // Add the expanded data
      };
    });

    // Create a worksheet from combined data
    const worksheet = XLSX.utils.json_to_sheet(
      combinedData.flatMap((item) => {
        const mainRow = columns.reduce((acc, column) => {
          acc[column.title] = item[column.dataIndex];
          return acc;
        }, {});

        // Add expanded data if exists
        const expandedRows = item.expandedData.map((subItem) => ({
          ...mainRow, // Add main row data to each expanded row
          ...subItem, // Add expanded row data
        }));

        return [mainRow, ...expandedRows];
      })
    );

    // Create a workbook with the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write the workbook to a file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }, [data, expandedRowData, columns, fileName]);

  return exportToExcel;
};

export default useExportToExcel;

import React, { useState } from "react";
import { Form } from "react-bootstrap";
import * as XLSX from "xlsx";

const TablePenilaian = ({
  dataTryout,
  data,
  dataNilai,
  exportExcell,
  setExportExcell,
}) => {
  const UrlParams = new URLSearchParams(document.location.search);
  const Kelas = UrlParams.get("kelas");
  const width = window.screen.width;
  const [ujianSelected, setUjianSelected] = useState("");

  const handlerExportExcell = (tableName) => {
    setExportExcell(false);
    if (exportExcell) {
      // Get the HTML table element
      const table = document.getElementById("table-data");

      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Convert the HTML table to a worksheet
      const ws = XLSX.utils.table_to_sheet(table);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, tableName);

      // Save the workbook as an Excel file
      XLSX.writeFile(wb, `${tableName}.xlsx`);
    }
  };

  if (exportExcell && Kelas != null && Kelas != "null") {
    handlerExportExcell(`Data Tryout Kelas ${Kelas}`);
  }
  return (
    <div className={width < 450 ? "w-element-admin" : ""}>
      {dataNilai.length > 0 ? (
        <Form.Select
          aria-label="Default select example"
          onChange={(e) => {
            setUjianSelected(e.target.value);
          }}
          className="w-element-admin m-3"
        >
          <option>Pilih Nilai Ujian</option>
          {data.map((item, index) => (
            <option value={item.nama_ujian} key={index}>
              {item.nama_ujian}
            </option>
          ))}
        </Form.Select>
      ) : null}
      <span className="fw-bold">Total Result: {dataNilai.length}</span>
      <div className="table-data overflow-x-scroll">
        <table
          className="table table-striped mt-3 w-element-admin table-bordered border-secondary"
          id="table-data"
        >
          <thead className="table-info">
            <tr>
              <th rowSpan="2" className="align-middle">
                No. Induk
              </th>
              <th rowSpan="2" className="align-middle">
                Nama
              </th>
              <th rowSpan="2" className="align-middle">
                Kelas
              </th>
              {data
                .filter((item) => item.nama_ujian == ujianSelected)
                .map((item, index) => (
                  <th
                    key={index}
                    className="text-center"
                    colSpan={item.data.length}
                  >
                    {item.nama_ujian}
                  </th>
                ))}
            </tr>
            <tr>
              {dataTryout
                .filter((item) => item.nama_ujian == ujianSelected)
                .map((item, index) => (
                  <th key={index} className="text-center">
                    {item.mapel}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {dataNilai.map((item, index) => (
              <tr key={index}>
                <td>{item.username}</td>
                <td>{item.nama}</td>
                <td>{`${item.kelas} ${item.tipeKelas}`}</td>
                {dataTryout
                  .filter((item) => item.nama_ujian == ujianSelected)
                  .map((m, i) => {
                    var NilaiValue = `${m.nama_ujian}_${m.mapel}`;
                    NilaiValue = NilaiValue.replaceAll(" ", "_");
                    return (
                      <td key={i} className="text-center">
                        {item[NilaiValue]}
                      </td>
                    );
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePenilaian;

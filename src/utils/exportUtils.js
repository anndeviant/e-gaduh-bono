import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Helper function untuk format tanggal
const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    return "-";
  }
};

// Export PDF
export const exportToPDF = (peternakData, laporanData) => {
  try {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("LAPORAN DATA PETERNAK", 105, 20, { align: "center" });
    doc.text("PROGRAM GADUH TERNAK DESA BONO", 105, 30, { align: "center" });

    // Garis horizontal
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Identitas Peternak
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("IDENTITAS PETERNAK", 20, 50);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    let yPos = 60;
    doc.text(`Nama Lengkap: ${peternakData.namaLengkap || "-"}`, 20, yPos);
    doc.text(`NIK: ${peternakData.nik || "-"}`, 105, yPos);

    yPos += 7;
    doc.text(`No. Telepon: ${peternakData.nomorTelepon || "-"}`, 20, yPos);
    doc.text(`Jenis Kelamin: ${peternakData.jenisKelamin || "-"}`, 105, yPos);

    yPos += 7;
    doc.text(`Alamat: ${peternakData.alamat || "-"}`, 20, yPos);
    doc.text(`Status: ${peternakData.statusSiklus || "-"}`, 105, yPos);

    yPos += 7;
    doc.text(
      `Tanggal Daftar: ${formatDate(peternakData.tanggalDaftar)}`,
      20,
      yPos
    );
    doc.text(
      `Jumlah Ternak Awal: ${peternakData.jumlahTernakAwal || "0"}`,
      105,
      yPos
    );

    yPos += 7;
    doc.text(
      `Target Pengembalian: ${peternakData.targetPengembalian || "0"}`,
      20,
      yPos
    );
    doc.text(`Jumlah Laporan: ${laporanData.length}`, 105, yPos);

    // Tambahkan tanggal selesai jika ada
    if (
      peternakData.tanggalSelesai &&
      peternakData.statusSiklus === "Selesai"
    ) {
      yPos += 7;
      doc.text(
        `Tanggal Selesai: ${formatDate(peternakData.tanggalSelesai)}`,
        20,
        yPos
      );
    }

    yPos += 15;

    // Tabel Laporan
    if (laporanData.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("DATA LAPORAN PERTEMUAN", 105, yPos, { align: "center" });
      yPos += 10;

      // Sort laporan data by report number (ascending)
      const sortedLaporanData = [...laporanData].sort((a, b) => {
        const aNum = parseInt(a.reportNumber) || 0;
        const bNum = parseInt(b.reportNumber) || 0;
        return aNum - bNum;
      });

      const tableData = sortedLaporanData.map((laporan, index) => [
        (index + 1).toString(), // Nomor urut
        `Laporan ${laporan.reportNumber || "-"}`,
        formatDate(laporan.tanggalLaporan),
        laporan.jumlahTernakAwal || "0",
        laporan.lahir || "0",
        laporan.mati || "0",
        laporan.terjual || "0",
        laporan.jumlahTernakSaatIni || "0",
      ]);

      // Calculate totals with new logic
      const totalLahir = sortedLaporanData.reduce(
        (sum, laporan) => sum + (parseInt(laporan.lahir) || 0),
        0
      );
      const totalMati = sortedLaporanData.reduce(
        (sum, laporan) => sum + (parseInt(laporan.mati) || 0),
        0
      );
      const totalTerjual = sortedLaporanData.reduce(
        (sum, laporan) => sum + (parseInt(laporan.terjual) || 0),
        0
      );
      // Total ternak adalah jumlah akhir dari laporan terakhir
      const laporanTerakhir = sortedLaporanData[sortedLaporanData.length - 1];
      const totalTernak = laporanTerakhir
        ? parseInt(laporanTerakhir.jumlahTernakSaatIni) || 0
        : 0;

      autoTable(doc, {
        startY: yPos,
        head: [
          [
            "No",
            "Laporan",
            "Tanggal",
            "Awal",
            "Lahir",
            "Mati",
            "Terjual",
            "Saat Ini",
          ],
        ],
        body: tableData,
        theme: "plain",
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 12, halign: "center" }, // No
          1: { cellWidth: 25, halign: "center" }, // Laporan
          2: { cellWidth: 25, halign: "center" }, // Tanggal
          3: { cellWidth: 18, halign: "center" }, // Awal
          4: { cellWidth: 18, halign: "center" }, // Lahir
          5: { cellWidth: 18, halign: "center" }, // Mati
          6: { cellWidth: 18, halign: "center" }, // Terjual
          7: { cellWidth: 18, halign: "center" }, // Saat Ini
        },
        margin: { left: (210 - 152) / 2 }, // Center table on page
      });

      // Get final Y position using multiple fallback methods
      // Add summary statistics below table
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("RINGKASAN STATISTIK", 105, yPos, { align: "center" });
      yPos += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      // Create statistics text
      const statsText = [
        `Total Ternak Saat Ini: ${totalTernak} ekor`,
        `Total Lahir: ${totalLahir} ekor`,
        `Total Mati: ${totalMati} ekor`,
        `Total Terjual: ${totalTerjual} ekor`,
      ];

      // Center align each statistic
      statsText.forEach((stat) => {
        doc.text(stat, 105, yPos, { align: "center" });
        yPos += 5;
      });

      yPos += 10; // Extra spacing after statistics
    }

    // Informasi Tambahan dalam bentuk tabel
    const informasiTambahanData = [];

    // Sort laporan for additional info
    const sortedLaporanData = [...laporanData].sort((a, b) => {
      const aNum = parseInt(a.reportNumber) || 0;
      const bNum = parseInt(b.reportNumber) || 0;
      return aNum - bNum;
    });

    sortedLaporanData.forEach((laporan) => {
      if (laporan.kendala && laporan.kendala.trim()) {
        informasiTambahanData.push([
          `Laporan ${laporan.reportNumber}`,
          "Kendala",
          laporan.kendala,
        ]);
      }
      if (laporan.solusi && laporan.solusi.trim()) {
        informasiTambahanData.push([
          `Laporan ${laporan.reportNumber}`,
          "Solusi",
          laporan.solusi,
        ]);
      }
      if (laporan.catatan && laporan.catatan.trim()) {
        informasiTambahanData.push([
          `Laporan ${laporan.reportNumber}`,
          "Catatan",
          laporan.catatan,
        ]);
      }
    });

    if (informasiTambahanData.length > 0) {
      // Check if we need new page
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text("INFORMASI TAMBAHAN", 105, yPos, { align: "center" });
      yPos += 10;

      autoTable(doc, {
        startY: yPos,
        head: [["Laporan", "Jenis", "Keterangan"]],
        body: informasiTambahanData,
        theme: "plain",
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
          halign: "center",
        },
        styles: {
          fontSize: 9,
          cellPadding: 4,
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
          valign: "top",
        },
        columnStyles: {
          0: { cellWidth: 30, halign: "center" }, // Laporan
          1: { cellWidth: 25, halign: "center" }, // Jenis
          2: { cellWidth: 97, halign: "left" }, // Keterangan
        },
        margin: { left: (210 - 152) / 2 }, // Center table on page
      });

      // Update yPos after table
      if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
        yPos = doc.lastAutoTable.finalY + 15;
      } else {
        yPos = yPos + informasiTambahanData.length * 8 + 30;
      }
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Halaman ${i} dari ${pageCount}`, 105, 290, { align: "center" });
      doc.text(`Dicetak pada: ${formatDate(new Date())}`, 190, 285, {
        align: "right",
      });
    }

    // Save
    const fileName = `Laporan_${peternakData.namaLengkap || "Unknown"}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  } catch (error) {
    throw error;
  }
};

// Export Excel
export const exportToExcel = (peternakData, laporanData) => {
  try {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Identitas Peternak
    const identitasData = [
      ["LAPORAN DATA PETERNAK"],
      ["PROGRAM GADUH TERNAK DESA BONO"],
      [""],
      ["IDENTITAS PETERNAK"],
      [""],
      ["Nama Lengkap", peternakData.namaLengkap || "-"],
      ["NIK", peternakData.nik || "-"],
      ["No. Telepon", peternakData.nomorTelepon || "-"],
      ["Jenis Kelamin", peternakData.jenisKelamin || "-"],
      ["Alamat", peternakData.alamat || "-"],
      ["Status Program", peternakData.statusSiklus || "-"],
      ["Tanggal Daftar", formatDate(peternakData.tanggalDaftar)],
      ["Jumlah Ternak Awal", peternakData.jumlahTernakAwal || 0],
      ["Target Pengembalian", peternakData.targetPengembalian || 0],
      ["Jumlah Laporan", laporanData.length],
    ];

    // Tambahkan tanggal selesai jika ada
    if (
      peternakData.tanggalSelesai &&
      peternakData.statusSiklus === "Selesai"
    ) {
      identitasData.push([
        "Tanggal Selesai",
        formatDate(peternakData.tanggalSelesai),
      ]);
    }

    identitasData.push(
      [""],
      ["DATA LAPORAN PERTEMUAN"],
      [""],
      [
        "No",
        "Laporan",
        "Tanggal",
        "Ternak Awal",
        "Lahir",
        "Mati",
        "Terjual",
        "Ternak Saat Ini",
      ]
    );

    // Sort laporan data by report number (ascending)
    const sortedLaporanData = [...laporanData].sort((a, b) => {
      const aNum = parseInt(a.reportNumber) || 0;
      const bNum = parseInt(b.reportNumber) || 0;
      return aNum - bNum;
    });

    // Add laporan data with sorting and numbering
    sortedLaporanData.forEach((laporan, index) => {
      identitasData.push([
        index + 1, // Nomor urut
        `Laporan ${laporan.reportNumber || "-"}`,
        formatDate(laporan.tanggalLaporan),
        laporan.jumlahTernakAwal || 0,
        laporan.lahir || 0,
        laporan.mati || 0,
        laporan.terjual || 0,
        laporan.jumlahTernakSaatIni || 0,
      ]);
    });

    // Add informasi tambahan
    identitasData.push([""]);
    identitasData.push(["INFORMASI TAMBAHAN"]);
    identitasData.push([""]);

    // Kendala
    const kendalaExists = sortedLaporanData.some(
      (l) => l.kendala && l.kendala.trim()
    );
    if (kendalaExists) {
      identitasData.push(["KENDALA:"]);
      sortedLaporanData.forEach((laporan) => {
        if (laporan.kendala && laporan.kendala.trim()) {
          identitasData.push([
            `Laporan ${laporan.reportNumber}`,
            laporan.kendala,
          ]);
        }
      });
      identitasData.push([""]);
    }

    // Solusi
    const solusiExists = sortedLaporanData.some(
      (l) => l.solusi && l.solusi.trim()
    );
    if (solusiExists) {
      identitasData.push(["SOLUSI:"]);
      sortedLaporanData.forEach((laporan) => {
        if (laporan.solusi && laporan.solusi.trim()) {
          identitasData.push([
            `Laporan ${laporan.reportNumber}`,
            laporan.solusi,
          ]);
        }
      });
      identitasData.push([""]);
    }

    // Catatan
    const catatanExists = sortedLaporanData.some(
      (l) => l.catatan && l.catatan.trim()
    );
    if (catatanExists) {
      identitasData.push(["CATATAN:"]);
      sortedLaporanData.forEach((laporan) => {
        if (laporan.catatan && laporan.catatan.trim()) {
          identitasData.push([
            `Laporan ${laporan.reportNumber}`,
            laporan.catatan,
          ]);
        }
      });
    }

    const ws = XLSX.utils.aoa_to_sheet(identitasData);

    // Styling
    const range = XLSX.utils.decode_range(ws["!ref"]);

    // Auto width
    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let max_width = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell_address = XLSX.utils.encode_cell({ c: C, r: R });
        const cell = ws[cell_address];
        if (cell && cell.v) {
          max_width = Math.max(max_width, cell.v.toString().length);
        }
      }
      colWidths[C] = { width: Math.min(max_width + 2, 50) };
    }
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Laporan Peternak");

    // Save
    const fileName = `Laporan_${peternakData.namaLengkap || "Unknown"}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    XLSX.writeFile(wb, fileName);
    console.log("Excel export completed successfully");
  } catch (error) {
    console.error("Error exporting Excel:", error);
    throw error;
  }
};

// Utility functions untuk mengatasi inkonsistensi data

/**
 * Mengambil nilai field dengan backward compatibility
 * Mendukung format camelCase dan snake_case
 */
export const getFieldValue = (item, fieldName, defaultValue = 0) => {
  if (!item) return defaultValue;

  // Mapping dari camelCase ke snake_case untuk backward compatibility
  const fieldMapping = {
    jumlahTernakAwal: "jumlah_awal",
    jumlahLahir: "jumlah_lahir",
    jumlahKematian: "jumlah_mati",
    jumlahTerjual: "jumlah_dijual",
    jumlahTernakSaatIni: "jumlah_saat_ini",
  };

  // Prioritas: camelCase terlebih dahulu, kemudian snake_case
  const primaryValue = item[fieldName];
  if (
    primaryValue !== undefined &&
    primaryValue !== null &&
    primaryValue !== ""
  ) {
    return primaryValue;
  }

  // Fallback ke snake_case jika ada mapping
  const snakeCaseField = fieldMapping[fieldName];
  if (
    snakeCaseField &&
    item[snakeCaseField] !== undefined &&
    item[snakeCaseField] !== null &&
    item[snakeCaseField] !== ""
  ) {
    return item[snakeCaseField];
  }

  return defaultValue;
};

/**
 * Normalize data object untuk konsistensi field names
 * Konversi semua snake_case ke camelCase
 */
export const normalizeDataFields = (data) => {
  if (!data || typeof data !== "object") return data;

  const fieldMapping = {
    // snake_case -> camelCase
    jumlah_awal: "jumlahTernakAwal",
    jumlah_lahir: "jumlahLahir",
    jumlah_mati: "jumlahKematian",
    jumlah_dijual: "jumlahTerjual",
    jumlah_saat_ini: "jumlahTernakSaatIni",
  };

  const normalizedData = { ...data };

  // Konversi snake_case ke camelCase
  Object.keys(fieldMapping).forEach((snakeKey) => {
    const camelKey = fieldMapping[snakeKey];

    // Jika snake_case ada tapi camelCase tidak ada atau kosong
    if (
      data[snakeKey] !== undefined &&
      (data[camelKey] === undefined ||
        data[camelKey] === null ||
        data[camelKey] === "")
    ) {
      normalizedData[camelKey] = data[snakeKey];
    }

    // Hapus snake_case field
    delete normalizedData[snakeKey];
  });

  return normalizedData;
};

/**
 * Batch normalize array of data objects
 */
export const normalizeDataArray = (dataArray) => {
  if (!Array.isArray(dataArray)) return dataArray;
  return dataArray.map((item) => normalizeDataFields(item));
};

/**
 * Validasi field numerik dan set default value
 */
export const validateNumericField = (value, defaultValue = 0) => {
  if (value === null || value === undefined || value === "" || isNaN(value)) {
    return defaultValue;
  }
  return Number(value);
};

/**
 * Safe getter untuk nested object properties
 */
export const safeGet = (obj, path, defaultValue = null) => {
  try {
    const keys = path.split(".");
    let result = obj;

    for (const key of keys) {
      if (result === null || result === undefined) {
        return defaultValue;
      }
      result = result[key];
    }

    return result !== undefined ? result : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

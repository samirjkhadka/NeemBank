// src/utils/emvQrGenerator.js

function formatEmvField(id, value) {
    const length = value.length.toString().padStart(2, '0');
    return `${id}${length}${value}`;
  }
  
  function generateEmvQr({ accountNumber, farmerName, city }) {
    const payloadFormat = formatEmvField('00', '01');
    const pointOfInitiationMethod = formatEmvField('01', '11'); // Static QR
    const merchantAccountInfo = formatEmvField('26',
      formatEmvField('00', 'NEPALBANK') +  // your bank identifier (custom in POC)
      formatEmvField('01', accountNumber)
    );
    const merchantCategoryCode = formatEmvField('52', '0000');
    const transactionCurrency = formatEmvField('53', '524'); // NPR
    const countryCode = formatEmvField('58', 'NP');
    const merchantName = formatEmvField('59', farmerName.substring(0, 25));
    const merchantCity = formatEmvField('60', city.substring(0, 15));
  
    const qrData = payloadFormat +
      pointOfInitiationMethod +
      merchantAccountInfo +
      merchantCategoryCode +
      transactionCurrency +
      countryCode +
      merchantName +
      merchantCity;
  
    // Later: CRC checksum for real production
    return qrData;
  }
  
  module.exports = {
    generateEmvQr,
  };
  
import fs from 'fs';
import path from 'path';

const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMDZlODhjOTdiOTcwOGNiODlmNWRiYiIsImlhdCI6MTc3ODgzNzY0NCwiZXhwIjoxNzc5NDQyNDQ0fQ.RC-eFr2CIsUY8XZu9-7w92_9sXayS-s2mbiwH2OWh2c';
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMDZlODhjOTdiOTcwOGNiODlmNWRiYiIsImlhdCI6MTc3ODgzNzY0NCwiZXhwIjoxNzc4ODM4NTQ0fQ.mr1q7jdjCCjZmfdTraqmYHMakDEu0jwzra5VzxSI8kE';

const form = new globalThis.FormData();
form.append('registeration_number', 'ABC123');
form.append('company', 'Toyota');
form.append('name', 'Corolla');
form.append('model', 'Corolla');
form.append('title', 'Test Vehicle');
form.append('base_package', 'Standard');
form.append('price', '100');
form.append('description', 'Test car');
form.append('year_made', '2020');
form.append('fuel_type', 'petrol');
form.append('seat', '5');
form.append('transmition_type', 'manual');
form.append('insurance_end_date', '2026-12-31');
form.append('registeration_end_date', '2027-12-31');
form.append('polution_end_date', '2027-12-31');
form.append('car_type', 'sedan');
form.append('location', 'City');
form.append('district', 'District');
form.append('addedBy', '6a06e88c97b9708cb89f5dbb');

const imagePath = path.resolve('client/src/Assets/homepage cars.jpg');
const fileContents = fs.readFileSync(imagePath);
const blob = new Blob([fileContents], { type: 'image/jpeg' });
form.append('image', blob, 'homepage cars.jpg');

const url = 'http://localhost:3000/api/vendor/vendorAddVehicle';

(async () => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken},${accessToken}`,
      },
      body: form,
    });
    console.log('STATUS', res.status, 'OK', res.ok);
    console.log(await res.text());
  } catch (err) {
    console.error(err);
  }
})();

const fetch = globalThis.fetch;
const url = 'http://localhost:3000/api/vendor/showVendorVehilces';
const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMDZlODhjOTdiOTcwOGNiODlmNWRiYiIsImlhdCI6MTc3ODgzNzY0NCwiZXhwIjoxNzc5NDQyNDQ0fQ.RC-eFr2CIsUY8XZu9-7w92_9sXayS-s2mbiwH2OWh2c';
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMDZlODhjOTdiOTcwOGNiODlmNWRiYiIsImlhdCI6MTc3ODgzNzY0NCwiZXhwIjoxNzc4ODM4NTQ0fQ.mr1q7jdjCCjZmfdTraqmYHMakDEu0jwzra5VzxSI8kE';

(async () => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken},${accessToken}`,
      },
      body: JSON.stringify({ _id: '6a06e88c97b9708cb89f5dbb' }),
    });
    console.log('STATUS:', res.status, 'OK:', res.ok);
    console.log('HEADERS:', Object.fromEntries(res.headers.entries()));
    console.log('BODY:', await res.text());
  } catch (err) {
    console.error(err);
  }
})();

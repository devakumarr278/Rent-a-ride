export const districtOptions = [
  "chennai",
  "coimbatore",
  "madurai",
  "trichy",
  "puducherry",
  "bengaluru",
  "mysuru",
  "kodagu",
  "alappuzha",
  "thiruvananthapuram",
  "ernakulam",
  "tirupati",
  "visakhapatnam",
];

export const locationOptions = [
  "Chennai International Airport",
  "Chennai Central Railway Station",
  "Marina Beach",
  "Mahabalipuram Shore Temple",
  "Puducherry Bus Stand",
  "Rock Beach",
  "Auroville Visitor Centre",
  "Kempegowda International Airport",
  "Majestic Bus Station",
  "Mysore Palace",
  "Coorg Bus Stand",
  "Cochin International Airport",
  "Ernakulam Junction",
  "Munnar Town Bus Stand",
  "Alappuzha Boat Jetty",
  "Coimbatore International Airport",
  "Udhagamandalam Bus Stand",
  "Madurai Junction",
  "Visakhapatnam Airport",
  "Tirupati Railway Station",
];

export const locationsByDistrict = districtOptions.reduce((acc, district) => {
  acc[district] = [...locationOptions];
  return acc;
}, {});

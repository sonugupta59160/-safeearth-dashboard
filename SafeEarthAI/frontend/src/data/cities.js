// Built-in Indian cities (instant search, works offline). Coordinates are city-centre approximations.
const RAW = [
  ['Delhi', 'Delhi', 28.6139, 77.209],
  ['Mumbai', 'Maharashtra', 19.076, 72.8777],
  ['Kolkata', 'West Bengal', 22.5726, 88.3639],
  ['Chennai', 'Tamil Nadu', 13.0827, 80.2707],
  ['Bengaluru', 'Karnataka', 12.9716, 77.5946],
  ['Hyderabad', 'Telangana', 17.385, 78.4867],
  ['Patna', 'Bihar', 25.5941, 85.1376],
  ['Guwahati', 'Assam', 26.1445, 91.7362],
  ['Bhubaneswar', 'Odisha', 20.2961, 85.8245],
  ['Visakhapatnam', 'Andhra Pradesh', 17.6868, 83.2185],
  ['Kochi', 'Kerala', 9.9312, 76.2673],
  ['Ahmedabad', 'Gujarat', 23.0225, 72.5714],
  ['Jaipur', 'Rajasthan', 26.9124, 75.7873],
  ['Lucknow', 'Uttar Pradesh', 26.8467, 80.9462],
  ['Dehradun', 'Uttarakhand', 30.3165, 78.0322],
  ['Shimla', 'Himachal Pradesh', 31.1048, 77.1734],
  ['Pune', 'Maharashtra', 18.5204, 73.8567],
];
export const CITIES = RAW.map(([c, s, lat, lon]) => ({ n: `${c}, ${s}`, lat, lon, src: 'builtin' }));

// DEMO DATA ONLY. Everything in this file is sample content shown with a "Demo" label.
export const ALERTS = [
  { id: 1, t: 'Flood', s: 'high', title: 'River level near danger mark', place: 'Riverside district', ago: '25 min ago', tip: 'Move valuables upstairs, avoid riverbanks, and know your nearest shelter route.', x: 34, y: 44 },
  { id: 2, t: 'Earthquake', s: 'low', title: 'M3.4 tremor recorded', place: 'Northern hills, 12 km depth', ago: '2 h ago', tip: 'No action needed. Check that shelves and heavy items are secured.', x: 70, y: 16 },
  { id: 3, t: 'Wildfire', s: 'med', title: 'Satellite heat hotspots detected', place: 'Eastern forest belt', ago: '3 h ago', tip: 'Hotspots are unconfirmed. Keep windows closed if smoke is visible.', x: 82, y: 46 },
  { id: 4, t: 'Cyclone', s: 'med', title: 'Low-pressure system forming offshore', place: 'Southern coast', ago: '6 h ago', tip: 'Charge phones, stock water, and follow official bulletins.', x: 55, y: 62 },
  { id: 5, t: 'Flood', s: 'low', title: 'Heavy rain outlook for 48 h', place: 'Citywide', ago: '9 h ago', tip: 'Clear drains near your home and avoid low-lying roads.', x: 20, y: 20 },
];

export const DEMO_PLACES = [
  { kind: 'hospital', n: 'District Hospital (demo)', x: 44, y: 34, i: '🏥' },
  { kind: 'hospital', n: 'Community Health Centre (demo)', x: 66, y: 54, i: '🏥' },
  { kind: 'shelter', n: 'Govt. School Shelter (demo)', x: 28, y: 58, i: '🏠' },
  { kind: 'shelter', n: 'Community Hall Shelter (demo)', x: 60, y: 26, i: '🏠' },
];

export const DEMO_RISK = { Flood: 72, Earthquake: 28, Wildfire: 41, Cyclone: 55 };

export const DEMO_WX = {
  t: 31, feels: 36, hum: 78, wind: 18, pres: 998, rain: 70, cond: 'Sample conditions', icon: '⛈️',
  hrs: [29, 28, 28, 30, 32, 33, 33, 31, 29, 28, 27, 27],
  hl: ['6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p', '12a', '2a', '4a'],
  days: [['Mon', '🌧️', 31, 25], ['Tue', '⛈️', 30, 24], ['Wed', '🌦️', 32, 25], ['Thu', '⛅', 33, 26], ['Fri', '☀️', 34, 26]],
};

export const TREND_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const TREND_SERIES = [
  { name: 'River level', d: [3.1, 3.3, 3.8, 4.4, 5.2, 5.9, 6.4], color: '#22d3ee', unit: 'm' },
  { name: 'Rainfall', d: [8, 12, 30, 44, 52, 38, 25], color: '#3b82f6', unit: 'mm' },
  { name: 'Seismic events', d: [2, 1, 3, 2, 4, 2, 3], color: '#818cf8', unit: 'events' },
];

export const NUMBERS = [
  ['112', 'National emergency'], ['108', 'Ambulance'], ['101', 'Fire'], ['100', 'Police'], ['1070', 'Disaster helpline (state)'],
];

export const CHECKLIST = [
  'Pack water, food, and medicines', 'Charge phones and power banks', 'Save copies of ID documents',
  'Learn your nearest shelter route', 'Agree a family meeting point',
];

// Offline assistant: a small built-in tips library used when the backend/Gemini is not reachable.
export const KB = [
  [/flood|rain|water/, '**If flooding is likely:**\n- Move to higher ground early\n- Never walk or drive through floodwater\n- Switch off electricity if water enters your home\n- Keep documents and medicines in a waterproof bag'],
  [/quake|earthquake|tremor|shake/, '**During an earthquake:**\n- **Drop**, take **cover** under sturdy furniture, and **hold on**\n- Stay away from windows and heavy shelves\n- Outdoors, move to an open area\n- Expect aftershocks and check for injuries'],
  [/fire|wildfire|smoke/, '**Wildfire safety:**\n- Leave early if told to evacuate\n- Close windows and wear an N95 mask in smoke\n- Keep your vehicle fuelled and facing out\n- Satellite hotspots are unconfirmed, so check official updates'],
  [/kit|prepare|bag|supplies/, '**Basic emergency kit:**\n- Water (3 litres per person per day) and dry food\n- Torch, power bank, radio\n- First-aid kit and regular medicines\n- ID copies, cash, and a whistle'],
  [/cyclone|storm|wind/, '**Before a cyclone:**\n- Secure loose objects and stock supplies\n- Charge phones and power banks\n- Follow official evacuation orders\n- Stay indoors away from windows during the storm'],
  [/hospital|shelter|nearby/, 'See the **Map** and **SOS** tabs for nearby hospitals and shelters. They come from OpenStreetMap when the backend is running, which can be incomplete, so call ahead when you can.'],
];
export const KB_FALLBACK = "I don't have a tip for that in offline mode. Try floods, earthquakes, wildfires, cyclones, or emergency kits. In a real emergency, call **112** (India) and follow official guidance.";
export const SUGGESTIONS = ['How to prepare for a flood?', 'What to do in an earthquake?', 'Build an emergency kit', 'Wildfire smoke safety'];

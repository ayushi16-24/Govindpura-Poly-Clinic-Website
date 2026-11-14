// Sirf allowed fields rakhta hai (mass-assignment se bachne ke liye)
const pick = (obj, fields) =>
  fields.reduce((acc, f) => {
    if (obj[f] !== undefined) acc[f] = obj[f];
    return acc;
  }, {});

export default pick;

export const INDIAN_FIRST_NAMES = [
  'Aarav', 'Aditya', 'Arjun', 'Ayaan', 'Ishaan', 'Krish', 'Reyansh', 'Sai', 'Vihaan', 'Vivaan',
  'Ananya', 'Diya', 'Ishani', 'Kavya', 'Myra', 'Navya', 'Prisha', 'Riya', 'Saanvi', 'Zoya'
];

export const INDIAN_LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Malhotra', 'Kapoor', 'Khanna', 'Mehra', 'Reddy', 'Patel', 'Deshmukh',
  'Chatterjee', 'Banerjee', 'Nair', 'Iyer', 'Menon', 'Kulkarni', 'Joshi', 'Singh', 'Kaur', 'Bose'
];

export const generateIndianName = () => {
  const first = INDIAN_FIRST_NAMES[Math.floor(Math.random() * INDIAN_FIRST_NAMES.length)];
  const last = INDIAN_LAST_NAMES[Math.floor(Math.random() * INDIAN_LAST_NAMES.length)];
  return `${first} ${last}`;
};

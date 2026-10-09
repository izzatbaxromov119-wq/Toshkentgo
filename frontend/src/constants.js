// Narx darajalari: nomi va rangi (dizayndagi ranglar bilan bir xil)
export const LEVELS = {
  budget: { label: "Budjet", color: "#10B981" },     // yashil
  standard: { label: "Standart", color: "#F59E0B" },  // to'q sariq
  premium: { label: "Premium", color: "#7C3AED" },    // binafsha
};

// Filtr tugmalari uchun ro'yxat
export const LEVEL_FILTERS = [
  { value: "", label: "Barchasi" },
  { value: "budget", label: "Budjet" },
  { value: "standard", label: "Standart" },
  { value: "premium", label: "Premium" },
];

export const REGIONS = [
  { value: "", label: "Barcha hududlar" },
  { value: "city", label: "Toshkent shahri" },
  { value: "province", label: "Toshkent viloyati" },
];

// Xaritaning boshlang'ich markazi (Toshkent)
export const TASHKENT_CENTER = [41.3111, 69.2797];

// Demo rejim (backendsiz, namuna ma'lumotlar bilan): `VITE_DEMO=1 npm run build`
export const DEMO = Boolean(import.meta.env.VITE_DEMO);

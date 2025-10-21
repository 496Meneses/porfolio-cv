const defaultLocale = "en";
const locales = {
  en: {
    label: "English",
    path: "",
  },
  es: {
    label: "Español",
    path: "es",
  },
};

export default {
  locales,
  defaultLocale,
  routes: {
    about: {
      en: "about",
      es: "sobre-mi",
    },
    experience: {
      en: "experience",
      es: "experiencia",
    },
    education: {
      en: "education",
      es: "educacion",
    },
    skills: {
      en: "skills",
      es: "habilidades",
    },
  },
};
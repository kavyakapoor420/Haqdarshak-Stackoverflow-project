import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};


// import React, { createContext, useState, useContext } from 'react';

// interface LanguageContextType {
//   language: 'en-IN' | 'hi-IN' | 'mr-IN';
//   changeLanguage: (lang: 'en-IN' | 'hi-IN' | 'mr-IN') => void;
// }

// export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [language, setLanguage] = useState<'en-IN' | 'hi-IN' | 'mr-IN'>('en-IN');

//   const changeLanguage = (lang: 'en-IN' | 'hi-IN' | 'mr-IN') => {
//     setLanguage(lang);
//   };

//   return (
//     <LanguageContext.Provider value={{ language, changeLanguage }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = (): LanguageContextType => {
//   const context = useContext(LanguageContext);
//   if (!context) {
//     throw new Error('useLanguage must be used within a LanguageProvider');
//   }
//   return context;
// };
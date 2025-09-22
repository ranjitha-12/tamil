// import { getRequestConfig } from "next-intl/server";

// export default getRequestConfig(async ({ locale }) => {
//   const currentLocale = locale ?? "en";
//   const messages = (await import(`../../messages/${currentLocale}.json`)).default;

//   return {
//     locale: currentLocale,
//     messages,
//   };
// });
import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async () => {
  const locale = 'en';
 
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
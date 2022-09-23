import { isLanguage } from "./languages";

export const load: import("./$types").PageLoad = ({ params }) => {
  if (!isLanguage(params.lang)) {
    throw new Error(`Invalid language: ${params.lang}`);
  }

  return {
    lang: params.lang,
  };
};

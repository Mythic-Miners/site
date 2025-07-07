import type enTranslations from '@/locales/en.json';

export type TranslationKeys = keyof typeof enTranslations;

// Helper type to get nested keys with dot notation
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationPath = NestedKeyOf<typeof enTranslations>;

// Type for language parameters
export interface LangParams {
  lang: string;
}

// Type for page props with language
export interface PagePropsWithLang {
  params: LangParams;
}

// Type for translation interpolation parameters
export interface InterpolationParams {
  [key: string]: string | number;
}

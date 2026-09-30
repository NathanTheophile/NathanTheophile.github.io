import { createContext } from "react";
import initialContent from "./content.json";

export type Media = { src: string; alt?: string };
export type ItemContent = {
  title: string;
  description: string;
  thumbnailMedia: Media | null;
  previewMedia: Media | null;
};
export type PortfolioContent = {
  identity: { name: string; role: string; email: string; logoMedia: Media | null };
  pages: { label: string; navLabel: string; headerLabel: string; title: string }[];
  interface: {
    moreProjects: string; moreTools: string;
    scrollCaption: string; scrollDescription: string;
    backCaption: string; backDescription: string;
  };
  contact: { heading: string; description: string; emailLabel: string };
  projects: Record<string, ItemContent>;
  skills: Record<string, ItemContent>;
};

export const savedContent: PortfolioContent = initialContent;
export const ContentContext = createContext(savedContent);
// Used only by the development preview; production renders no edit controls.
export const EditContext = createContext<((path: string) => void) | null>(null);

export function mediaUrl(src: string) {
  return src.startsWith("media/") ? `${import.meta.env.BASE_URL}${src}` : src;
}

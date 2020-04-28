export interface ISituations {
  [name: string]: ISituation
}
  
export interface ISituation {
  header: string;
  description: string;
  options: string[];
}

export enum ContentType {
  youtube = "youtube",
  options = "options",
  iframe = "iframe",
}
  
export interface IContent<T extends YoutubeContent | OptionsContent> {
  position: number[];
  type: ContentType;
  header: string;
  content: T;
}

export type AnyContent = IContent<YoutubeContent> | IContent<OptionsContent> | IContent<IframeContent>;

export interface YoutubeContent {
  url: string;
}

export interface IframeContent {
  url: string;
  height?: number | string;
}

export interface OptionsContent {
  description: string;
  bannerImg: string;
  options: string[];
  correctAnswers: number[];
}

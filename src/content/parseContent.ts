import rawJson from './content.json';
import { IContent, ContentType, OptionsContent, YoutubeContent, IframeContent } from '../common/constants';

const parsed = rawJson.map((json) => {
  const type: ContentType = (ContentType as any)[json.type];
  switch (type) {
    case ContentType.options: 
      return json as any as IContent<OptionsContent>;
    case ContentType.youtube: 
      return json as any as IContent<YoutubeContent>;
    case ContentType.iframe: 
      return json as any as IContent<IframeContent>;
  }
});
export default parsed;
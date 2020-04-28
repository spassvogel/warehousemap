import React from 'react';
import { YoutubeContent } from '../../common/constants';
import ReactPlayer from "react-player";

interface Props {
  content: YoutubeContent;
}

const YoutubeModalContent = (props: Props) => {
  const {content} = props;
  return (
    <ReactPlayer
      url={content.url}
      width="100%"
    /> 
  )
}

export default YoutubeModalContent;
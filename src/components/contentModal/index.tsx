import React from 'react';
import ReactModal from 'react-modal';
import './modal.css';
import { AnyContent, ContentType, YoutubeContent, OptionsContent, IframeContent } from '../../common/constants';
import YoutubeModalContent from './YoutubeModalContent';
import OptionsModalContent from './OptionsModalContent';
import IframeModalContent from './IFrameModalContent';

interface Props {
  content: AnyContent;
  onClose: () => void;
}

const ContentModal = (props: Props) => {
  const { content, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  const renderContent = () => {
    switch(content.type) {
      case ContentType.youtube: 
        return <YoutubeModalContent content={content.content as YoutubeContent} />
      case ContentType.options: 
        return <OptionsModalContent content={content.content as OptionsContent} />
      case ContentType.iframe: 
        return <IframeModalContent content={content.content as IframeContent} />
    }
  }

  return (
    <ReactModal
      isOpen={true}
      ariaHideApp={false}
      overlayClassName={"modal-overlay"}
      className={`modal-content`}
      onRequestClose={() => handleClose()}
    >
      <>
        <div className="header">
          <h1>{content.header} </h1>
          <div className="modal-close" onClick={() => handleClose()}></div>
        </div>
        {renderContent()}
      </>
    </ReactModal>  
  )
}

export default ContentModal;


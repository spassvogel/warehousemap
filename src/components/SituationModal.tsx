import React, { useState } from 'react';
import Modal from 'react-modal';
import Situations from './../content/situations.json';
import { ISituations } from '../common/constants';
import { ReactComponent as CheckSvg } from './../images/ui/check.svg';
import './situationModal.css';

interface Props {
  situationId: string;
  onClose: () => void;
  onOptionChosen: (option: number) => void;
}

const SituationModal = (props: Props) => {
  const { situationId, onClose, onOptionChosen } = props;

  const situation = (Situations as ISituations)[situationId];
  const [selectedOption, selectOption] = useState<number | null>();
  const [warningShown, setWarningShown] = useState<boolean>(false);

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onOptionChosen(selectedOption!);
    onClose();
  };

  return (
    <Modal
      isOpen={situationId !== null}
      ariaHideApp={false}
      overlayClassName={"modal-overlay"}
      className={`modal-content ${situationId}`}
      onRequestClose={() => handleClose()}
    >
      { situationId && (
        <>
          <div className="header">
            <h1>{situation.header} </h1>
            <div className="modal-close" onClick={() => handleClose()}></div>
          </div>
          <div className="banner">

          </div>
          <p>
              {situation.description}
          </p>
          <ul className="options">
            {situation.options.map((option, index) => (
              <li key={option} className={index === selectedOption ? "active" : ""} onClick={() => selectOption(index)} >
                <div className="checkbox">
                  <CheckSvg className="check" />
                </div>
                <div>
                  {option}
                </div>
              </li>
            ))}
          </ul>
          <div className="control">
            { !warningShown && (
              <button disabled={selectedOption === null} onClick={() => setWarningShown(true)}>
                <b>Okay</b>
              </button>
            )}
            { warningShown && (
              <>
                <button disabled={selectedOption === null} onClick={() => handleConfirm()}>
                  <b>I'm sure</b>
                </button>
                <button disabled={selectedOption === null} onClick={() => handleClose()}>
                  Never mind
                </button>
                <div className="warning">
                  {selectedOption !== null && (
                  <span>
                    Are you sure you want to deal with this situation at this time?
                    This means you prioritize this situation over any still active situations.
                  </span>)}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </Modal>  
  )
}

export default SituationModal;


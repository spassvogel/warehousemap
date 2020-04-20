import React, { useRef, useEffect, useState } from 'react';
import Situations from '../content/situations.json';
import { ISituations } from '../common/constants';

import './situationOrder.css';

interface Props {
  situationOrder: string[]
}

const SituationOrder = (props: Props) => {
  const {situationOrder} = props;

  if (!situationOrder.length) {
    return null;
  }

  return (
    <div className="situation-order">
      <p>
        <b>Issues are solved in this order:</b>
      </p>
      <ol>
        {situationOrder.map((name) => {
          const situation = (Situations as ISituations)[name];
          return <li key={name}>{situation.header}</li>;
        })}
      </ol>
    </div>

  )
}

export default SituationOrder;
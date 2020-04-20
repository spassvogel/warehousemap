import React, { useRef, useEffect, useState } from 'react';
import Situations from './../content/situations.json';
import { ISituations } from '../common/constants';

import './scenarioOrder.css';

interface Props {
  scenarioOrder: string[]
}

const ScenarioOrder = (props: Props) => {
  const {scenarioOrder} = props;

  if (!scenarioOrder.length) {
    return null;
  }

  return (
    <div className="scenario-order">
      <p>
        <b>Issues are solved in this order:</b>
      </p>
      <ol>
        {scenarioOrder.map((scenario) => {
          const situation = (Situations as ISituations)[scenario];
          return <li key={scenario}>{situation.header}</li>;
        })}
      </ol>
    </div>

  )
}

export default ScenarioOrder;
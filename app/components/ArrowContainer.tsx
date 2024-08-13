import React from 'react';
import { Xwrapper, useXarrow } from 'react-xarrows';
import ComponentA from './ComponentA';
import ComponentB from './ComponentB';
import Xarrow from 'react-xarrows';

const ArrowContainer = () => {
    return (
      <div className='flex justify-evenly'>
        <ComponentA />
        <div className='h-30 bg-yellow-50'></div>
        <ComponentB />
        <Xarrow start="componentA" end="componentB" />
      </div>
    );
  };
  export default ArrowContainer;
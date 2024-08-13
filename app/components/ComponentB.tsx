import React, { useEffect } from 'react';
import { useXarrow } from 'react-xarrows';

const ComponentB = () => {
  const updateXarrow = useXarrow();

  useEffect(() => {
    updateXarrow();
  }, [updateXarrow]);

  return <div style={{background: 'lightblue'}}> Component B </div>;
};

export default ComponentB;
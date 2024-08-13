import React, { useEffect } from 'react';
import { useXarrow } from 'react-xarrows';


  
const ComponentA = () => {
  const updateXarrow = useXarrow();

  useEffect(() => {
    updateXarrow();
  }, [updateXarrow]);

  return <div style={{background: 'lightblue'}}> Component A </div>;
};

export default ComponentA;
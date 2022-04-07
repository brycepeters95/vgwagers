import React, { useState, useEffect } from 'react';

function useStickyState(key, defaultValue) {
    const [state, setState] = React.useState(
     ()=> JSON.parse(localStorage.getItem(key)) || defaultValue
    );
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
  }
 export default useStickyState;
import React, {useState, useEffect} from 'react'

const useDropDownLeaderboard = (label, defaultState, options) => {
    const [state, setState] = useState('All Games');

    useEffect(() => {
      console.log(state);
    }, [state]);
  
    const Dropdownmaker = () => (
      <label htmlFor={label}>
        {label}
        <select
          id={label}
          value={state}
          onChange={(e) => setState(e.target.value)}
          onBlur={(e) => setState(e.target.value)}
          disabled={!options.length}
        >
          {options.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
    );
    return [state, Dropdownmaker, setState];
}

export default useDropDownBestOf;
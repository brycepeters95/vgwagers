
import React from 'react'

const useCalendarSelector = () => {
    const [value, onChange] = useState(new Date());
    return (
        <div>
            <DatePicker
        onChange={onChange}
        value={value}
      /> 
        </div>
    )
}

export default useCalendarSelector




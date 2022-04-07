import React from 'react'

const Message = ({sendMessage, setTheMessage, themessage}) => (
    <div className='chat-form-container'>
    <form id='chat-form'>   
      <input
        id='msg'
        type='text'
        placeholder='Enter Message'
        required
        autocomplete='off'
        value={themessage}
        onChange={({ target: { value } }) => setTheMessage(value)}
        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
      />
       <button onClick={(e)=> sendMessage(e)}>  <i className='fas fa-paper-plane'></i> Send</button>
    
    </form>
  </div>
)
  


export default Message

import React from 'react';
// need to import date function
import moment from 'moment';
import ScrollToBottom from 'react-scroll-to-bottom';
const WagerChat = ({ themessages }) => (
    <ScrollToBottom>
    <div className='chat-messages'>
                  
                  {themessages.map((message, i) => <div key={i}>
                  <span className ="message-sender"> {message.sender}</span>
                      <p className = "message-text">{message.text}</p>
                      <div className="message-time">Sent At:{moment(message.time).format('h:mm a')}</div>
                      <span className="line"></span>
                      {/* line */}
                     </div>)}
                
                </div> 
                </ScrollToBottom> 
  
  );
  
  export default WagerChat;
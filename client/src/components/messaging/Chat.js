import React, { useState, useEffect, Fragment,useRef } from 'react';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getWagerForChat } from '../../actions/wager';
import io from "socket.io-client";
import WagerChat from './WagerChat';
import Message from './Message';


const ENDPOINT = 'https://vgwagers.com:443';
let socket;

const Chat = ({auth: { user, loading } }) => {
  const [themessages, setTheMessages] = useState([]);
  const [room, setRoom] = useState(localStorage.getItem("wagerChatId"));
  const [themessage, setTheMessage] = useState('');
 

 

  useEffect(()=>{
     socket =io(ENDPOINT)
    socket.emit('join', room);
    socket.emit('setUser', user._id);

      socket.on('oldchat', chat =>{
        console.log(chat)
        setTheMessages([...chat]) 
    }) 
    socket.on('message', chat =>{
   console.log(chat,'update')
      setTheMessages([...chat])
    })
 
    return () => {
      if(socket) socket.disconnect();
      localStorage.removeItem("wagerChatId");
    }
  
  }, [room,ENDPOINT]);

  // useEffect=(()=>{
   
  // },[])

  // const enterRoom = (user)=>{
  //   socket.emit('new user', {
  //     wagerid: room,
  //     username: user.username,
  //   });
  //   socket.on('messages', function (data) {
  //     data.map((message) => {
  //        console.log(data)
  //       setTheMessages([...themessages,message]);
  //       console.log(themessages,'themessages')
  //     });
  //   });
  // }

  // const addMessage = (msg) => setMessages(prevMessages => [...prevMessages, msg]);

  // const onChange = (e) => setTheMessage(e.target.value)
  // console.log(themessage);


  const sendMessage = (e) =>{
    e.preventDefault();
    const username = user.username;
    const theMessageObject = {username, themessage, room}
    console.log(room)
    if(themessage){
      socket.emit('send Message',theMessageObject, ()=> setTheMessage(''), console.log(themessage,'1', themessages,'2'));
    }
  }



  return loading && user === null ? (
    <Spinner />
  ) : (
    <Fragment>
    <div>
      <header className='App-header'>
        {room ? (
          <Fragment>
            <div className='chat-container'>
              <header className='chat-header'>
                <h1>VGWagers Chat</h1>
              </header>
              <main className='chat-main'>
                <div className='chat-sidebar'>
                  <h3>
                    Wager:
                    <br />
                    {room}
                  </h3>
                  <h2 id='room-name'></h2>
                </div>
            
           
                  <WagerChat themessages={themessages} />
            
              
                
              </main>
           
                 {/* change css for input at 400 px */}
                  <Message themessage = {themessage} setTheMessage={setTheMessage} sendMessage={sendMessage} />
       
               
            </div>
          </Fragment>
        ) : null}
      </header>
    </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  wager: state.wager,
});

export default connect(mapStateToProps, {})(Chat);

import React, { Component, version, useState,Fragment,useEffect } from 'react';
import { connect } from 'react-redux';
//dispute form action,
//state user and wager
 import {setDisputeFormWager} from '../../actions/wager';
import axios from 'axios';

import Spinner from '../layout/Spinner';
// import useStickyState from '../../custom-hooks/useStickyState';

const DisputeForm = ({ auth:{user, loading}, setDisputeFormWager} ) => {

  const [disputeForm, setDisputeForm] = useState({
    id: localStorage.getItem('disputeFormId'),
    desc: '',
  //  video file for upload... need own state?(like search user for wager)
  });
  const [fileOne, setFileOne]= useState('');
  const [filenameOne, setFilenameOne] = useState('Choose File One');
  const [fileTwo, setFileTwo]= useState('');
  const [filenameTwo, setFilenameTwo] = useState('Choose File Two');
  const [fileThree, setFileThree]= useState('');
  const [filenameThree, setFilenameThree] = useState('Choose File Three');

  
  const { username, desc,id } = disputeForm;
  

 useEffect(() => {

   return () => {
localStorage.removeItem("disputeFormId")
   }
 },[]) 
 
// useEffect(() => {
 
//   localStorage.setItem("disputedWager", JSON.stringify(disputeForm))
//   console.log('hit1')
//   return()=>{
//     localStorage.removeItem("disputedWager");
//     console.log('hit2')
//   }
//   });


  const onChangeUploadOne = e => {
    setFileOne(e.target.files[0]);
    setFilenameOne(e.target.files[0].name);
  };
  const onChangeUploadTwo = e => {
    setFileTwo(e.target.files[0]);
    setFilenameTwo(e.target.files[0].name);
  };
  const onChangeUploadThree = e => {
    setFileThree(e.target.files[0]);
    setFilenameThree(e.target.files[0].name);
  };

  const onSubmitUpload = async e => {
    e.preventDefault();
    let data = new FormData();
    // console.log(path.extname(file.originalname))
    data.append('upload', fileOne );
    data.append('upload', fileTwo );
    data.append('upload', fileThree );
    data.append('id', disputeForm.id);
    data.append('desc', disputeForm.desc);
console.log(data.getAll('upload'));
   setDisputeFormWager(data)

    // try {
    //   const res = await axios.post('/api/wager/disputeForm', data,  {
    //     headers: {
    //       'Content-Type': 'multipart/form-data'
    //     }
    
    //   });



  
    // } catch (err) {
    //   if (err.response.status === 500) {
    //     setMessage('There was a problem with the server');
    //   } else {
    //     setMessage(err.response.data.msg);
    //   }
    // }
  };



  const onChange = e =>
    setDisputeForm({ ...disputeForm, [e.target.name]: e.target.value,
     });




  

     return loading && user === null ? (
      <Spinner />
    ) : (
    <Fragment>
      <h1 className='large text-primaryy'>Dispute Form</h1>

 
      {/* </Fragment> */}
      <form className='form' onSubmit={e => onSubmitUpload(e)}>
        <div className='form-group'>
            <h2 className='text-primaryy'>{user.username}</h2>
            
            
        </div>

        <div className='form-group'>
            <h2 className='text-primaryy'>Wager Match:{id}</h2>
        </div>

        <div className='form-group'>
          <div className='disputeformdescription bg-white p-2'>
            <h2 className='text-primaryy'>Dispute Description:</h2>

            <textarea
              rows='4'
              cols='100'
              placeholder='describe the situation'
              name='desc'
              value={desc}
              onChange={e => onChange(e)}
            ></textarea>
          </div>
        </div>
  
      
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='fileInput' 
            onChange={onChangeUploadOne}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filenameOne}
          </label>
        </div>
          
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='fileInput' 
            onChange={onChangeUploadTwo}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filenameTwo}
          </label>
        </div>
          
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='fileInput' 
            onChange={onChangeUploadThree}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filenameThree}
          </label>
        </div>



  

       
 
      

        {/* two form classes second one for adding files figure out? then add to models and routes */}

        <input type='submit' className='btn btn-primary my-1' />
      </form>
    </Fragment>
  );
};

//on change

// on submit

// fields
DisputeForm.propTypes = {

};

const mapStateToProps = state => ({
  auth: state.auth,
  wager: state.wager
});

export default connect(mapStateToProps,{setDisputeFormWager})(DisputeForm);

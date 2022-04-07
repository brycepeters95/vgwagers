

import React from 'react'
import { Link } from 'react-router-dom';
const Footer = () => {
    return (
       
         <footer className="page-footer font-small special-color-dark pt-4">

<div className="container-footer">
<div className = 'landingline'></div>
  <ul className="list-unstyled list-inline text-center">


    <li className="list-inline-item">
      <a className="btn-floating btn-tw mx-1" href= "https://twitter.com/WagersVg">
        <i className="fab fa-twitter"> </i>
      </a>
    </li>
    <li className="list-inline-item">
      <a className="btn-floating btn-dribbble mx-1" href= "https://instagram.com/vgwagers">
        <i className="fab fa-instagram" > </i>
      </a>
    </li>
  </ul>
    <div className='center'> <Link to='/how-to'>How To</Link></div>

</div>



<div className="footer-copyright text-center py-3">© 2021 Copyright:
  <a href="https://vgwagers.com/"> VGWagers</a>
</div>


</footer>

        
    )
}

export default Footer;



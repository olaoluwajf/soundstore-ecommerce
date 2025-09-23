import './Footer.css'
import { Link } from 'react-router-dom'

function Footer() {
    return(
        <div className='footer-section'>
<Link to='/' className="footer-logo">SoundStore</Link>
<div classname='rights'>
    <p>All Rights Reserved - ©2025</p>
</div>
<div classname='credits'><p>Built by <a href='https://github.com/olaoluwajf' target='_blank'>
Joshua Famiroju</a></p>
</div>
        </div>
    )
}

export default Footer
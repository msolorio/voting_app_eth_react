import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <h1 className="header-title">Voting App</h1>
      <nav className="header-nav">
        <ul className="header-ul">
          <li className="header-li"><Link className="header-link" to="/polls/new">Create</Link></li>
          <li className="header-li"><Link className="header-link" to="/polls/vote">Vote</Link></li>
          <li className="header-li"><Link className="header-link" to="/polls/tally">Tallies</Link></li>
          <li className="header-li"><Link className="header-link" to="/polls/reset">Reset</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;

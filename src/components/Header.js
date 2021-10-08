import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/polls/new">Create Poll</Link></li>
          <li><Link to="/polls">All Polls</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;

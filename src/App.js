import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/Header';
import PollCreate from './pages/PollCreate';
import PollVote from './pages/PollVote';
import PollTallies from './pages/PollTallies';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />

      <Switch>
        <Route exact path="/" render={() => <Redirect to="/polls/vote" />} />

        <Route path="/polls/new" render={() => <PollCreate />} />
        
        <Route exact path="/polls/vote" render={() => <PollVote />} />

        <Route path="/polls/tally" render={() => <PollTallies />} />
      </Switch>
    </div>
  );
}

export default App;

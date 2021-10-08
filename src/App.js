import { Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import PollCreate from './pages/PollCreate';
import PollIndex from './pages/PollIndex';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />

      <Switch>
        <Route path="/polls/new" render={() => <PollCreate />} />
        
        <Route path="/polls" render={() => <PollIndex />} />
      </Switch>
    </div>
  );
}

export default App;

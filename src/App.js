import { createContext, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import LogIn from './components/Login/Login';

export const UserContext = createContext();

function App() {

  const [loggedInUser, setLoggedInUser] = useState({})

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    success: false,
    error: '',
    newUser: false
  })

  return (
    <div className="App">
      <UserContext.Provider value={{ loggedInUser, setLoggedInUser, user, setUser }}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <LogIn></LogIn>
            </Route>
            <Route path="/login">
              <LogIn />
            </Route>

          </Switch>
        </BrowserRouter>
      </UserContext.Provider>

    </div>
  );
}

export default App;

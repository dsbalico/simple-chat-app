import firebase from 'firebase/app';
import { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { AuthProvider } from "./components/auth/AuthProvider";
import PrivateRoute from './components/auth/PrivateRoute';
import Chatroom from './components/Chatroom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Profile from './components/Profile';
import { db } from './firebaseConfig';

function App() {
  const MINUTE_MS = 60000;

  useEffect(() => {
    const interval = setInterval(() => {

      // Delete rooms created after 24 hours
      let yesterday = firebase.firestore.Timestamp.now();
      yesterday.seconds = yesterday.seconds - (24 * 60 * 60);

      db.collection("Rooms").where("createdAt","<",yesterday)
      .get().then((querySnapshot) => {
        querySnapshot.forEach(element => {
          element.ref.delete();
        });
      })

      // Delete meessages sent after 10 mins
      let after10Mins =  firebase.firestore.Timestamp.now();
      after10Mins.seconds = after10Mins.seconds - (1 * 10 * 60);

      db.collection("Rooms").get().then((querySnapshot) => {
        querySnapshot.forEach((element) => {
          element.ref.collection("Conversation").where("sentAt","<",after10Mins).get().then((querySnapshot) => {
            querySnapshot.forEach((element) => {
              element.ref.delete();
            });
          });
        });
      })

      // Delete all users in a room if there are no activity for 15 mins.
      let after15Mins = firebase.firestore.Timestamp.now();
      after15Mins.seconds = after15Mins.seconds - (1 * 15 * 60);

      db.collection("Rooms").where("latestMessageSent", "<", after15Mins).get().then((rooms) => {
        rooms.forEach((room) => {
          room.ref.collection("Users").get().then((users) => {
            users.forEach((user) => {
              user.ref.delete();
            })
          })
        });
      });
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, [])

  return (
    <AuthProvider>
      <BrowserRouter>
            <Switch>
              <Route path="/login" component={ Login } exact={true} />
              <PrivateRoute path="/" component={ Dashboard } exact={true}/>
              <PrivateRoute path="/chatroom/:roomId" component={ Chatroom } exact={true}/>
              <PrivateRoute path="/profile" component={ Profile } exact={true}/>
            </Switch>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

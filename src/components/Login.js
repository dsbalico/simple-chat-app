import firebase from 'firebase/app';
import React, { useContext } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import app from './../firebaseConfig';
import { AuthContext } from './auth/AuthProvider';

function Login(props) {

    const handleSignIn = (signInMethod) => {
        
        if(signInMethod === "guest") {

            app.auth().signInAnonymously()
            .then((user) => {
                props.history.push("/");
            })
            .catch((error) => {
                document.getElementById("displayError").style.display = "block";
            });
            
        } else {
            let provider;

            if(signInMethod === "google") {
                provider = new firebase.auth.GoogleAuthProvider();
            } else if(signInMethod === "facebook") {
                provider = new firebase.auth.FacebookAuthProvider();
            }

            app.auth()
            .signInWithPopup(provider)
            .then(() => {
                props.history.push("/");
                
            }).catch((error) => {
                document.getElementById("displayError").style.display = "block";
            });
        }
    }

    const { currentUser } = useContext(AuthContext);
    
    if(currentUser) {
        return <Redirect to="/" />
    }

    return (
        <div className="h-screen bg-gray-900 flex flex-wrap content-center justify-center">
            <div className="w-64">
                <div className="bg-white text-center shadow-md rounded px-8 pt-6 pb-3 mb-1">
                    <h1 className="text-gray-900 text-3xl font-bold">Chat<span className="text-red-600">Room</span></h1>
                    <small className="text-gray-500">Your online chatting website</small>

                    <hr className="mt-1 mb-3" />

                    <h2 className="font-medium mb-3">Login with</h2>
                    
                    
                    <button type="button" onClick={ () => { handleSignIn("guest") } } className="w-full bg-gray-400 rounded hover:bg-gray-500 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline">Guest</button>
                    
                    <div className="grid grid-cols-2 gap-2  mt-2 overflow-hidden">
                        <button type="button" onClick={ () => { handleSignIn("facebook") } } className="w-full bg-blue-800 rounded hover:bg-blue-900 text-white font-bold py-2 px-8 focus:outline-none focus:shadow-outline">
                            <svg xmlns="http://www.w3.org/2000/svg" className="text-white fill-current" width="25" height="24" viewBox="0 0 24 24">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                            </svg>
                        </button>

                        <button type="button" onClick={ () => { handleSignIn("google") } } className="w-full bg-red-700 rounded hover:bg-red-800 text-white font-bold px-8 focus:outline-none focus:shadow-outline">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 172 172">
                                <g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" ><path d="M0,172v-172h172v172z"></path>
                                    <g fill="#ffffff"><path d="M89.90583,73.3795v27.38383h39.0225c-5.10267,16.59083 -18.97017,28.466 -39.0225,28.466c-23.87933,0 -43.2365,-19.35717 -43.2365,-43.22933c0,-23.87217 19.35717,-43.22933 43.2365,-43.22933c10.73567,0 20.53967,3.9345 28.1005,10.41317l20.167,-20.167c-12.73517,-11.60283 -29.67717,-18.6835 -48.2675,-18.6835c-39.58867,0 -71.681,32.08517 -71.681,71.66667c0,39.5815 32.09233,71.66667 71.681,71.66667c60.17133,0 73.45117,-56.25833 67.553,-84.194z"></path>
                                    </g>
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
                <footer>
                    <p className="text-gray-500 text-center text-sm">Made by Daniel Shan Balico</p>  
                    
                    {/* Error Message */}
                    <p id="displayError" className="text-center text-xs text-red-800 mt-8 hidden">An account with different provider already exists with the same email address.</p>
                </footer>

            </div>

        </div>
    )
}

export default withRouter(Login)

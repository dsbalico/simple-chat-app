import React, { useContext } from 'react';
import app from './../firebaseConfig';
import { AuthContext } from './auth/AuthProvider';
import Navbar from './parts/Navbar';

function Profile(props) {
    const {currentUser} = useContext(AuthContext);
    
    return (
        <div className="h-screen bg-gray-900">
            <Navbar 
                currentUser={currentUser} 
                history={props.history} 
                profile={true} />

            <div className="h-screen-80 bg-gray-900 flex flex-wrap content-center justify-center">
                <div className="text-center text-white">
                    <img src={ currentUser.photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" } width="150px" className="rounded-full mx-auto" alt={ currentUser.displayName || "Guest User" } />

                    <h1 className="mt-5 text-2xl font-bold">{ currentUser.displayName || "Guest User" }</h1>
                    <p className="text-gray-500">{ currentUser.email || "No Email" }</p>

                    <button 
                        onClick={ () => app.auth().signOut() } 
                        className="w-full bg-red-700 rounded hover:bg-red-800 text-gray-300 font-bold py-2 px-4 focus:outline-none focus:shadow-outline mt-5">
                            Sign out
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Profile

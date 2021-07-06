import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { db } from './../firebaseConfig';
import { AuthContext } from './auth/AuthProvider';
import Navbar from './parts/Navbar';
import Room from './parts/Room';

function Dashboard(props) {
    const {currentUser} = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        // Read all rooms from firestore and store into "rooms array"
        if(searchText === "") {
            db.collection("Rooms").orderBy("createdAt").onSnapshot((querySnapshot) => {
                let roomsTemp = [];
        
                querySnapshot.forEach((doc) => {
                    roomsTemp.push(doc.data());
                });
    
                setRooms(roomsTemp);
            }) 
        }
        else {
            db.collection("Rooms").where("roomName", "==", searchText).onSnapshot((querySnapshot) => {
                let roomsTemp = [];
        
                querySnapshot.forEach((doc) => {
                    roomsTemp.push(doc.data());
                });
    
                setRooms(roomsTemp);
            }) 
        }    
    }, [searchText])

    return (
        <div className="h-screen bg-gray-900">
            <Navbar 
                currentUser={currentUser} 
                history={props.history} />
            
            <div className="h-screen-80 flex flex-wrap content-center justify-center">
                <div className="h-1/2 lg:w-1/4 sm:w-1/2 text-center shadow-lg rounded-3xl p-3 ml-2 mr-2">
                    <h1 className="text-white text-3xl font-bold mb-4">Chat<span className="text-red-500">Rooms</span></h1>
                    
                    <label className="text-white">Search Room: 
                        <input onChange={ (e) => {setSearchText(e.target.value); console.log(e.target.value)} } placeholder="Search Room" className="bg-gray-800 p-2 mb-3 rounded-lg shadow" />
                    </label>
                    
                    <hr className="mb-3 border-gray-800" />
                    
                    <div className="h-full w-full bg-gray-200 rounded-xl shadow-lg p-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 overflow-y-scroll">

                        {/* Display all data from rooms array */}
                        {
                            rooms.length < 1 ? (
                                <small className="text-gray-600">There are no rooms right now.</small>
                            ) : (
                                rooms &&
                                rooms.map((query) => {
                                    return (
                                        <Room
                                            uid={currentUser.uid}
                                            key={query.roomName} 
                                            query={query} 
                                            history={props.history} />
                                    )
                                    
                                })
                            )
                        } 

                    </div>

                    <small className="text-gray-700"> Note: Rooms are deleted after 24 hours.</small> <br/>      
                </div>
            </div>
            
        </div>
    )
}

export default withRouter(Dashboard)

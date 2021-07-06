import React, { useEffect, useState } from 'react';
import { db } from './../../firebaseConfig';

const Room = (props) => {
    const { query, history, uid } = props;
    const [userCount, setUserCount] = useState(0);
    
    useEffect(() => {
        db.collection("Rooms").doc(query.roomName).collection("Users")
        .onSnapshot((querySnapshot) => {
            setUserCount(querySnapshot.size);
        });

        return () => {}
    }, [query])

    const joinRoom = (addUser) => {
        history.push("/chatroom/" + query.roomName);
        
        if(addUser) { 
            db.collection("Rooms").doc(query.roomName).collection("Users").doc(uid).set({});
        }
    }

    return (
        <div className="grid grid-cols-3 gap-4 border-b border-gray-300 mb-3 text-center text-gray-900 mt-3 pb-2">
            <p className="truncate">{ query.roomName }</p>
            <p className="">{ userCount } People</p>
            {
                query.requirePassword ? (
                    <p className="bg-green-500 hover:bg-green-600 rounded cursor-pointer flex justify-center text-white" onClick={ () => joinRoom(false) }>
                        <span><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-4 text-white mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg></span>
                        Join
                    </p>
                ): (
                    <p className="bg-green-500 hover:bg-green-600 rounded cursor-pointer text-white" onClick={ () => joinRoom(true) }>Join</p>
                )
            }
           
        </div>
    )
}

export default Room

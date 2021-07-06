import firebase from 'firebase/app';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { db } from './../firebaseConfig';
import { AuthContext } from './auth/AuthProvider';
import Message from './parts/Message';
import RoomInfoModal from './parts/RoomInfoModal';
import RoomPasswordModal from './parts/RoomPasswordModal';

function Chatroom(props) {
    const {currentUser} = useContext(AuthContext);
    const [conversation, setConversation] = useState([]);
    const [messagesEnd, setMessagesEnd] = useState([]);
    const [openInfo, setOpenInfo] = useState(false);
    const cancelButtonRef = useRef(null);
    const [roomInfo, setRoomInfo] = useState([]);
    const [isNotAuthenticated, setIsNotAuthenticated] = useState(false);
    const [tempAuth, setTempAuth] = useState(false);

    useEffect(() => {
        // Show Room passwordModal if the room needs a password
        if(roomInfo.requirePassword) {
            setIsNotAuthenticated(true);
        } else {
            setIsNotAuthenticated(false);
        }
    }, [roomInfo.requirePassword])

    useEffect(() => {
        // Read all messages from firestore and store into conversation array
        db.collection("Rooms").doc(props.match.params.roomId).collection("Conversation").orderBy("sentAt").onSnapshot((querySnapshot) => {
            let convoTemp = [];
    
            querySnapshot.forEach((doc) => {
                convoTemp.push(doc);
            });

            setConversation(convoTemp);
        }); 

        // Read current room info
        db.collection("Rooms").doc(props.match.params.roomId).get().then((doc) => {
            setRoomInfo(doc.data());  

        });

        //Show RoomPasswordModal if not authenticated
        if (isNotAuthenticated) {
            setTempAuth(true);
        } else {
            setTempAuth(false);
        }

        // Display/hide the loading page while the auth is not set
        setTimeout(() => {
            const pageCover = document.getElementById("pageCover");
            if(pageCover) {
                if (tempAuth) {
                    pageCover.style.display = "block";
                } else {
                    pageCover.style.display = "none";
                }
            }
        }, 700);


    }, [props.match.params.roomId, isNotAuthenticated, tempAuth])

    const handleSendMessage =  (event) => {
        event.preventDefault();
        
        const {
            message
        } = event.target.elements;

        db.collection("Rooms").doc(props.match.params.roomId).collection("Conversation").add({
            "Message": message.value,
            "displayName": currentUser.displayName,
            "sentAt": firebase.firestore.FieldValue.serverTimestamp(),
            "photoURL": currentUser.photoURL,
            "uid": currentUser.uid,
        });

        db.collection("Rooms").doc(props.match.params.roomId).update({ "latestMessageSent": firebase.firestore.FieldValue.serverTimestamp() });

        event.target.reset();

        // scroll to the bottom of the page every after sending the message
        setTimeout(() => { 
            messagesEnd.scrollIntoView({ behavior: "smooth" });
        }, 200);
    }

    return (
        <div className="bg-gray-900 flex flex-col h-screen">
            <div id="pageCover" className="flex flex-wrap content-center justify-center h-screen w-screen bg-gray-900 absolute z-20 inset-x-0">
                <div className="h-screen flex flex-wrap content-center">
                    <svg className="animate-spin mx-auto" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"width="28" height="28"viewBox="0 0 172 172">
                        <g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" >
                            <path d="M0,172v-172h172v172z" fill="none"></path>
                            <g fill="#ffffff">
                                <path d="M86,7.16667c-43.5375,0 -78.83333,35.29583 -78.83333,78.83333c0,43.5375 35.29583,78.83333 78.83333,78.83333c43.5375,0 78.83333,-35.29583 78.83333,-78.83333c0,-43.5375 -35.29583,-78.83333 -78.83333,-78.83333zM87.419,149.10967c-20.56833,0 -39.89683,-10.06917 -51.7075,-26.94667c-2.26467,-3.23933 -1.4835,-7.70417 1.763,-9.98317c3.26083,-2.26467 7.7185,-1.47633 9.98317,1.763c9.13033,13.03617 24.07283,20.82633 39.9685,20.82633c26.875,0 48.74767,-21.8655 48.74767,-48.74767c0,-25.2625 -19.70117,-46.612 -44.85617,-48.59717c-3.94883,-0.31533 -6.89433,-3.7625 -6.579,-7.71133c0.31533,-3.94167 3.741,-6.8585 7.71133,-6.579c32.54383,2.58 58.05,30.20033 58.05,62.89467c0,34.77983 -28.294,63.081 -63.081,63.081z"></path>
                            </g>
                        </g>
                    </svg>
                </div>
            </div>

            <header className="bg-gray-900 p-3 shadow-lg fixed w-screen">
                <div className="flex float-left">
                    <button onClick={ () => {
                        db.collection("Rooms").doc(roomInfo.roomName).collection("Users").doc(currentUser.uid).delete(); 
                        props.history.push("/") 
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-9 w-6 text-white hover:text-gray-300" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                    </button>
                    <h1 className="block h-8 w-auto text-white text-3xl font-bold" >Chat<span className="text-red-500">Room</span></h1>
                </div>
                      
                <div className="float-right ">
                    <svg 
                        onClick={() => { setOpenInfo(true) }} 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-10 text-gray-600 cursor-pointer hover:text-gray-500 w-8"
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                    >
                        <path 
                            fillRule="evenodd" 
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                            clipRule="evenodd" 
                        />
                    </svg>
                </div>
            </header>
            
            <div id="chatContainer" className="h-screen bg-gray-900 lg:w-1/2 lg:mx-auto mt-20 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 overflow-y-scroll mb-4 pb-3 pt-3">
               
               <div className="text-center border-b w-1/2 mx-auto pb-2 border-gray-800 mb-8">
                    <h1 className="text-white text-2xl text-center font-bold">{ props.match.params.roomId }</h1>
                    <small className="text-gray-600">{ roomInfo.description }</small>
               </div>
                
                {/* Display all data from conversation array  */}
                { 
                    conversation.map(message => (
                        <Message key={message.id} message={message.data()}  />
                    ))
                }  
                
                {/* For scrollIntoView  */}
                <div ref={(el) => { setMessagesEnd(el) }}> </div>
            </div>
            

            <form className="mb-4 flex flex-row bg-gray-800 rounded-md px-4 py-3 z-10 max-w-full-lg mx-5 shadow-md" onSubmit={ handleSendMessage } >
                <input type="text" id="message"
                    placeholder="Type your message here..." 
                    className="flex-1 text-white bg-transparent outline-none" required/>
            
                <button 
                    type="submit" 
                    className="uppercase font-semibold text-sm tracking-wider text-gray-500 hover:text-gray-700 transition-colors"
                > Send </button>

            </form>

            <RoomInfoModal
                createdBy={roomInfo.createdBy}
                uid={currentUser.uid} 
                roomDescription={roomInfo.description}
                roomName={props.match.params.roomId} 
                history={props.history} 
                openInfo={openInfo} 
                setOpenInfo={setOpenInfo} 
                cancelButtonRef={cancelButtonRef} />

            <RoomPasswordModal 
                uid={currentUser.uid}
                roomName={props.match.params.roomId} 
                tempAuth={tempAuth}
                setTempAuth={setTempAuth}
                isNotAuthenticated={ isNotAuthenticated }
                setIsNotAuthenticated={ setIsNotAuthenticated }
                roomPassword={roomInfo.password} />
        </div>
    )
}

export default Chatroom

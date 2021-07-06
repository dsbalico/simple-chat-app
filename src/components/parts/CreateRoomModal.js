import { Dialog, Transition } from '@headlessui/react';
import firebase from 'firebase/app';
import { Fragment, useCallback, useState } from 'react';
import { db } from '../../firebaseConfig';

export default function CreateRoomModal(props) {
  const { open, setOpen, cancelButtonRef, currentUserID, history } = props;
  const [requirePassword, setRequirePassword] = useState(false);
  const [roomExistError, setRoomExistError] = useState(false);

  const handleAddRoom = useCallback(async event => {
    event.preventDefault();

    const {
      roomName, password, description
    } = event.target.elements;

    try {

      const docRef = db.collection("Rooms").doc(roomName.value);

      docRef.get().then((doc) => {
        if (doc.exists) {
          setRoomExistError(true);
        } else {
          db.collection("Rooms").doc(roomName.value).set({
            "roomName": roomName.value,
            "description": description.value,
            "requirePassword": requirePassword,
            "password": password ? password.value : null,
            "createdAt": firebase.firestore.FieldValue.serverTimestamp(),
            "createdBy": currentUserID,
          });

          setOpen(false);
          history.push("/chatroom/"+roomName.value);
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
 
    }
    catch(error) {
      console.log(error);
    }

  }, [requirePassword, setOpen, currentUserID, history])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        open={open}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg">
              <form className="w-full" onSubmit={ handleAddRoom }>
                <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-lg text-center leading-6 font-medium text-white">
                          Create A Room
                        </Dialog.Title>

                        <div className="mt-2">
                          <label className="text-white font-medium">Room Name: 
                            <input type="text" id="roomName" className="rounded p-2 bg-gray-900 text-white w-full" placeholder="Room Name" required />
                          </label>
                          
                          <br  /><br  />
                          
                          <label className="text-white font-medium">Room Description: 
                            <textarea type="text" id="description" className="rounded p-2 bg-gray-900 text-white w-full" placeholder="Room Description" required />
                          </label>
                          
                          <br  />

                          <div className="flex items-center mt-3 mb-2 w-full">
                            <label htmlFor="requirePassword" className="flex items-center cursor-pointer">
                                <div className="relative">
                                  <input 
                                    id="requirePassword" 
                                    type="checkbox"
                                    checked={ requirePassword }
                                    onChange={() => { setRequirePassword(!requirePassword)} } 
                                    className="sr-only" 
                                  />
                                  
                                  <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                                  <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                                </div>
                                
                                <div className="ml-3 text-white font-medium">Require Password</div>
                            </label>
                          </div>

                          {
                            requirePassword ? (
                              <label className="text-white font-medium">Password: 
                                <input type="password" id="password" className="rounded p-2 bg-gray-900 text-white w-full" placeholder="Password" required/>
                              </label>
                            )
                            : null
                          }

                        </div>
                      
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse text-center">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Create Room
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-whitetext-base font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                  {
                    roomExistError ? (
                      <small className="text-center text-red-600 text-xs">ROOM NAME EXISTS!</small>
                    ) : null
                  }
                  
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
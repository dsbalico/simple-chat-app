import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { db } from '../../firebaseConfig';

function RoomInfoModal(props) {
    const { 
        createdBy,
        uid, 
        openInfo, 
        setOpenInfo, 
        cancelButtonRef, 
        history, 
        roomName, 
        roomDescription } = props;

    const deleteRoom = () => {
        db.collection("Rooms").doc(roomName).delete();
        
        history.push("/");
    }

    return (
        <Transition.Root show={openInfo} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-10 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={openInfo}
                onClose={setOpenInfo}
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
                        
                            <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 sm:mt-0 sm:text-left">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-300">
                                    Room Info
                                    </Dialog.Title>

                                    <div className="w-full mt-2">
                                        <h1 className="text-white font-bold text-2xl">{ roomName }</h1>
                                        <p className="text-gray-600">{ roomDescription }</p>
                                    </div>

                                    <hr className="border-gray-700 mt-3" />
                                    <small className="text-gray-600">Note: Messages are deleted after 10 minutes.</small>
                                
                                </div>
                            </div>
                            </div>
                            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse text-center">
                            <button
                                onClick={ () => { 
                                    history.push("/"); 
                                    db.collection("Rooms").doc(roomName).collection("Users").doc(uid).delete(); 
                                } }
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Leave Room
                            </button>
                            {
                                (createdBy === uid) ? (
                                    <button
                                        onClick={() => deleteRoom()}
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border border-transparent shadow-sm px-4 py-2 text-white bg-whitetext-base font-medium bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Delete Room
                                    </button>
                                ): null
                            }
                            
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-whitetext-base font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => setOpenInfo(false)}
                                ref={cancelButtonRef}
                            >
                                Cancel
                            </button>   
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default RoomInfoModal

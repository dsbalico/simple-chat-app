import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { db } from './../../firebaseConfig';
 
function RoomPasswordModal(props) {
    const { 
        roomName,
        uid,
        tempAuth, 
        setIsNotAuthenticated, 
        cancelButtonRef, 
        roomPassword } = props;

    const handleSubmitPassword = (event) => {
        event.preventDefault();

        const { password } = event.target.elements;

        if(password.value === roomPassword) {
            setIsNotAuthenticated(false);   
            db.collection("Rooms").doc(roomName).collection("Users").doc(uid).set({}); 
        }
        else {
            document.getElementById("displayError").style.display = "block";
        }

    }

    return (
        <Transition.Root show={tempAuth} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-30 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                open={tempAuth}
                onClose={() =>{}}
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
                        <Dialog.Overlay className="fixed inset-0 bg-gray-900 transition-opacity" />
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
                            <form onSubmit={ handleSubmitPassword }>
                                <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-300">
                                                Enter Password
                                            </Dialog.Title>

                                            <div className="w-full mt-2">
                                                <input id="password" type="password" className="bg-gray-900 rounded p-2 text-white" placeholder="Password"  required />
                                            </div>
                                        
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse text-center">
                                <button
                                    
                                    type="submit"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Enter Room
                                </button>
                                <p id="displayError" className="text-center text-xs text-red-800 hidden">Incorrect Password</p>   
                                </div>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default RoomPasswordModal

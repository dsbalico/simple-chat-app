import { Disclosure, Menu, Transition } from '@headlessui/react';
import React, { Fragment, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import app from './../../firebaseConfig';
import CreateRoomModal from './CreateRoomModal';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

  
function Navbar(props) {
    const { currentUser, history, profile } = props;
    const [open, setOpen] = useState(false);

    const cancelButtonRef = useRef(null);

    const redirectTo = (location) => {
        history.push("/" + location);
    }
    
    return (
        <div>
            <Disclosure as="nav" className="bg-gray-900">
                {({ open }) => (
                <>
                    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                        <div className="relative flex items-center justify-between h-16">
                            <div className="flex-1 flex items-center ">
                                <div className="flex-shrink-0 flex items-center">
                                    <h1 className="block lg:hidden h-8 w-auto text-white text-3xl font-bold" >Chat<span className="text-red-500">Room</span></h1>
                                    <h1 className="hidden lg:block h-8 w-auto text-white text-3xl font-bold" >Chat<span className="text-red-500">Room</span></h1>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {
                                    // Do not display the create room button if user is in the profile page
                                    !profile ? ( 
                                        <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                            <p onClick={() => { setOpen(true) }}>Create Room</p>
                                        </button>
                                    ) : (
                                        <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                            <p onClick={() => { redirectTo("") }}>Back to Home</p>
                                        </button>
                                    )
                                }
                                
                                {/* Profile dropdown */}
                                <Menu as="div" className="ml-3 relative">

                                    {({ open }) => (
                                    <>
                                        <div>
                                            <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                                <span className="sr-only">Open user menu</span>
                                                <img className="h-8 w-8 rounded-full" src={ currentUser.photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" } alt={currentUser.displayName} />
                                            </Menu.Button>
                                        </div>

                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items static className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" >
                                                
                                                {
                                                    !profile ? (
                                                        <Menu.Item>
                                                            {
                                                                ({ active }) => (
                                                                    
                                                                    <p
                                                                        onClick={ () => redirectTo("profile") }
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100' : '',
                                                                            'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                                                                        )}
                                                                        >
                                                                        Your Profile
                                                                    </p>
                                                                )
                                                            }
                                                        </Menu.Item> 

                                                    ) : null
                                                }

                                                <Menu.Item>
                                                    {
                                                        ({ active }) => (
                                                            <p
                                                            onClick={ () => app.auth().signOut() }
                                                            className={classNames(
                                                                active ? 'bg-gray-100' : '',
                                                                'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                                                            )}
                                                            >
                                                            Sign out
                                                            </p>
                                                        )
                                                    }
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </>
                                    )}
                                </Menu>
                            </div>
                        </div>
                    </div>
                </>
                )}
            </Disclosure>

            <CreateRoomModal 
                history={history}
                currentUserID={currentUser.uid} 
                open={open} setOpen={setOpen} 
                cancelButtonRef={cancelButtonRef} />
        </div>
    )
}

export default withRouter(Navbar)

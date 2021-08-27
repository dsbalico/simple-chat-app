import { formatRelative } from 'date-fns';
import React, { useContext } from 'react';
import { AuthContext } from './../auth/AuthProvider';

const formatDate = date => {
  let formattedDate = '';

  if (date) {
    // Convert the date in words relative to the current date
    formattedDate = formatRelative(date, new Date());

    // Uppercase the first letter
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  
  return formattedDate;
};


function Message(props) {
    const {currentUser} = useContext(AuthContext);

    return (
        <div className="mx-4">
            {
                // If the user who sent the message is the currentUser
                props.message.uid === currentUser.uid ? (
                    <div className="chat-message mt-2">
                        <div className="flex items-end justify-end">
                            <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order- items-end">
                                <div>
                                    <span 
                                        className="px-4 py-2 rounded-lg inline-block max-w-sm break-all float-right rounded-br-none bg-blue-600 text-white "
                                        dangerouslySetInnerHTML={{
                                            __html: props.message.Message.replace(/(https?:\/\/[^\s]+)/g, (url) => {
                                                return '<a href=' + url + ' class="underline hover:text-gray-300" >' + url + '</a>'
                                             })
                                        }}
                                        > 
                                    </span> <br/>
                                    <small  className="float-right text-gray-600">
                                        { props.message.displayName || "Guest User" } - {formatDate(new Date( props.message.sentAt ? props.message.sentAt.seconds * 1000 : null))}
                                    </small> 
                                </div>
                            </div>
                            <img src={ props.message.photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" } alt={ props.message.displayName } className="w-6 h-6 rounded-full order-2"/>
                            
                        </div>
                    </div>
                ) : (
                    <div className="chat-message mt-2">
                        <div className="flex items-end">
                            <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                                <div>
                                    <span className="px-4 py-2 rounded-lg inline-block max-w-sm break-all rounded-bl-none bg-gray-800 text-gray-100"
                                    dangerouslySetInnerHTML={{
                                        __html: props.message.Message.replace(/(https?:\/\/[^\s]+)/g, (url) => {
                                            return '<a href=' + url + ' class="text-red-300 hover:text-red-400" >' + url + '</a>'
                                         })
                                    }}
                                    >
                                    </span> <br/>
                                    <small className="text-gray-600">
                                        { props.message.displayName || "Guest User"  } - {formatDate(new Date( props.message.sentAt ? props.message.sentAt.seconds * 1000 : null))}
                                    </small>
                                </div>
                            </div>
                            <img src={ props.message.photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" } alt={ props.message.displayName } className="w-6 h-6 rounded-full order-1"/>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Message

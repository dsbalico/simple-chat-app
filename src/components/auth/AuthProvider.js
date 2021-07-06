import React, { useEffect, useState } from 'react';
import app from '../../firebaseConfig';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        app.auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
            setPending(false);
        });
    }, []);

    if(pending) {
        return (
            <div className="h-screen flex flex-wrap justify-center content-center bg-gray-900">
               <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"width="28" height="28"viewBox="0 0 172 172">
                    <g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" >
                        <path d="M0,172v-172h172v172z" fill="none"></path>
                        <g fill="#ffffff">
                            <path d="M86,7.16667c-43.5375,0 -78.83333,35.29583 -78.83333,78.83333c0,43.5375 35.29583,78.83333 78.83333,78.83333c43.5375,0 78.83333,-35.29583 78.83333,-78.83333c0,-43.5375 -35.29583,-78.83333 -78.83333,-78.83333zM87.419,149.10967c-20.56833,0 -39.89683,-10.06917 -51.7075,-26.94667c-2.26467,-3.23933 -1.4835,-7.70417 1.763,-9.98317c3.26083,-2.26467 7.7185,-1.47633 9.98317,1.763c9.13033,13.03617 24.07283,20.82633 39.9685,20.82633c26.875,0 48.74767,-21.8655 48.74767,-48.74767c0,-25.2625 -19.70117,-46.612 -44.85617,-48.59717c-3.94883,-0.31533 -6.89433,-3.7625 -6.579,-7.71133c0.31533,-3.94167 3.741,-6.8585 7.71133,-6.579c32.54383,2.58 58.05,30.20033 58.05,62.89467c0,34.77983 -28.294,63.081 -63.081,63.081z"></path>
                        </g>
                    </g>
                </svg>
            </div>
        )
    }

    return (
        <AuthContext.Provider
            value={{currentUser}}
        >
            {children}
        </AuthContext.Provider>
    );
};

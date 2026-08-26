import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import auth from "../firebase/auth";
import { db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const UserContext = createContext();

export function UserProvider({ children }) {

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {

            if (!user) {
                setUserData(null);
                setLoading(false);
                return;
            }

            try {

                const snap = await getDoc(
                    doc(db, "users", user.uid)
                );

                if (snap.exists()) {
                    setUserData({
                        uid: user.uid,
                        ...snap.data()
                    });
                }

            } catch (error) {
                console.log(error);
            }

            setLoading(false);

        });

        return () => unsubscribe();

    }, []);

    return (
        <UserContext.Provider
            value={{
                userData,
                setUserData,
                loading
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
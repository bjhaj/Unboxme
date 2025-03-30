import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => { 
   const [session, setSession] = useState(undefined);
   
    const signUpNewUser = async (email, password) => {
        console.log('Attempting to sign up user:', { email }); // Don't log passwords
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password 
            });
            
            console.log('Supabase signUp response:', { data, error });
            
            if (error) {
                console.error("Signup error:", error);
                return { success: false, error };
            }
            return { success: true, data };
        } catch (err) {
            console.error("Unexpected error during signup:", err);
            return { success: false, error: err };
        }
    };

   const signOut = async () => {
        const {error} = await supabase.auth.signOut();
        if (error) {
            console.error("there was a problem signing out", error);
        } 
    };
     
    const signInUser = async (email, password) => {
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            console.error("there was a problem signing in", error);
            return {success: false, error};
        }
        return {success: true, data};
    };

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
            console.log('Current session:', session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            console.log('Auth state changed:', { event: _event, session });
        });

        return () => subscription.unsubscribe();
    }, []);
    
   return (
    <AuthContext.Provider value={{ session, signUpNewUser, signOut, signInUser}}>
      {children}
    </AuthContext.Provider>  
   );
}

export const UserAuth = () => {
    return useContext(AuthContext);
};

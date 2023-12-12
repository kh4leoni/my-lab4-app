import React, { ReactNode, useEffect } from "react"
import { useContext, useState } from "react"
import { auth } from "../../firebase"
import { User, UserCredential, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"

interface AuthProviderProps {
  children: ReactNode
}

interface AuthContextType {
  currentUser: User | null
  signUp: (email: string, password: string) => Promise<UserCredential>
  signIn: (email: string, password: string) => Promise<UserCredential> 
}


const AuthContext = React.createContext<AuthContextType | null>(null)


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)


  const signUp = (email: string, password: string) => {

    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
    
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  },[])
  


  const value: AuthContextType = {
    currentUser,
    signUp,
    signIn,

  }
  return(
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
    )
  }

  export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === null) {
      throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
  }
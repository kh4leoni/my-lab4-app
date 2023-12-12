import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonRouter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { logInOutline, personCircleOutline } from "ionicons/icons";
import { auth } from "../../firebase";

import shoppingCart from "../assets/shopping.svg";

import "./Login.css";
import { UserCredential, signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "../hooks/useToast";
import Menu from "./NewList";
import { useAuth } from "../context/AuthContext";

type User = {
  email: string | null
}

const Login: React.FC = () => {
  const router = useIonRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [present, dismiss] = useIonLoading();
  const toast = useToast();

  const { signIn } = useAuth()

  useEffect(() => {

  },[present])

  const loginUser = async (e: any) => {
    e.preventDefault();

    try {
      const res = await signIn(email, password)

      if (res) {
  
        present("Logging in")
        setTimeout(() => {
          dismiss()

          router.push('/app')
          setEmail("")
          setPassword("")
        },1500)
      }
      
    } catch (error) {
      toast("Incorrect email or password. Try again.", "bottom")
      console.log(error)
    }
  };

  return (
<>
<IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="ion-text-center">
          <IonTitle>My Shopping List</IonTitle>
        </IonToolbar>
      </IonHeader>

    
           <IonContent scrollY={false} className="ion-padding">
           <IonGrid fixed>
             <IonRow class="ion-justify-content-center">
               <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                 <div className="ion-text-center ion-padding ion-margin-top">
                   <img src={shoppingCart} alt="Shopping-cart" width={"50%"} />
                 </div>
               </IonCol>
             </IonRow>
   
             <IonRow class="ion-justify-content-center">
               <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                 <IonCard className="ion-card-form">
                   <IonCardContent>
                     <form onSubmit={loginUser}>
                       <IonInput
                         fill="outline"
                         labelPlacement="floating"
                         label="Email"
                         type="email"
                         placeholder="your@email.fi"
                         value={email}
                         onIonChange={(e: any) => setEmail(e.target.value)}
                       ></IonInput>
                       <IonInput
                         className="ion-margin-top"
                         fill="outline"
                         labelPlacement="floating"
                         label="Password"
                         type="password"
                         placeholder="password"
                         value={password}
                         onKeyUp={(e: any) => setPassword(e.target.value)}
                       ></IonInput>
                       <IonButton
                         className="ion-margin-top"
                         expand="block"
                         type="submit"
                       >
                         Login
                         <IonIcon icon={logInOutline} slot="end" />
                       </IonButton>
                       <IonButton
                         color="secondary"
                         className="ion-margin-top"
                         expand="block"
                         routerLink="/register"
                       >
                         Create account
                         <IonIcon icon={personCircleOutline} slot="end" />
                       </IonButton>
                     </form>
                   </IonCardContent>
                 </IonCard>
               </IonCol>
             </IonRow>
           </IonGrid>
         </IonContent>

 
      <IonFooter>
        <IonToolbar color="primary" className="ion-text-center">
          <IonText className="ion-margin-top">
            Labwork4 Applications Inc.
          </IonText>
        </IonToolbar>
      </IonFooter>
    </IonPage>
    </>
  );
};

export default Login;

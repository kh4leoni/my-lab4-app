import {
  IonBackButton,
  IonButton,
  IonButtons,
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

import shoppingCart from "../assets/shopping.svg";
import { logInOutline, personCircleOutline } from "ionicons/icons";
import { Redirect } from "react-router";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../context/AuthContext";


const Register: React.FC = () => {
  const router = useIonRouter();
  const [present, dismiss] = useIonLoading();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");



  const toast = useToast();
  const { signUp } = useAuth()

  const registerUser = async (e: any) => {
    e.preventDefault();

    try {

      if (password !== confirmPassword) {
        toast("Passwords don't match. Try again", 'bottom')
      }
      const res = await signUp(email, password)

      present("Creating account") 
      setTimeout(() => {
        dismiss()
        router.push('/app')
      setEmail("")
      setPassword("")
      setConfirmPassword("")  
      }, 1500)


    } catch (error) {
      console.log(error)
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="ion-text-center">
          <IonTitle>My Shopping List</IonTitle>
          <IonButtons>
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false} className="ion-padding">
        <IonGrid fixed>
          <IonRow class="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4"></IonCol>
          </IonRow>

          <IonRow class="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <IonCard>
                <IonCardContent>
            <form onSubmit={registerUser}>
                    <IonInput
                      fill="outline"
                      labelPlacement="floating"
                      label="Email"
                      type="email"
                      placeholder="your@email.fi"
                      value={email}
                      onIonChange={(e: any) => setEmail(e.target.value)}
                    />
                    <IonInput
                      className="ion-margin-top"
                      fill="outline"
                      labelPlacement="floating"
                      label="Password"
                      type="password"
                      placeholder="password"
                      value={password}
                      onIonChange={(e: any) => setPassword(e.target.value)}
                    />
                    <IonInput
                      className="ion-margin-top"
                      fill="outline"
                      labelPlacement="floating"
                      label="Confirm password"
                      type="password"
                      placeholder="confirm password"
                      value={confirmPassword}
                      onKeyUp={(e: any) =>
                        setConfirmPassword(e.target.value)
                      }
                    />
                    <IonButton
                      className="ion-margin-top"
                      expand="block"
                      type="submit"
                    >
                      Create Account
                      <IonIcon icon={personCircleOutline} slot="end" />
                    </IonButton>
                    <div className="ion-text-center ion-margin-top">
                      <p> Already have an account?</p>
                    </div>
                    </form>
                    <IonButton
                      color="secondary"
                      className="ion-margin-top"
                      expand="block"
                      routerLink="/"
                    >
                      
                      Login
                      <IonIcon icon={logInOutline} slot="end" />
                    </IonButton>

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
  );
};

export default Register;

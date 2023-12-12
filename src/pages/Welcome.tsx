import { IonButton, IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar, useIonLoading } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Route, useHistory } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import './Welcome.css';

const Welcome: React.FC = () => {
  const { currentUser } = useAuth();
  const history = useHistory();
  const [present, dismiss] = useIonLoading();
  const [loading, setLoading] = useState(true)

  const logOut = async () => {
    await signOut(auth);
    present("Logging out...");
    setTimeout(() => {
      dismiss();
      history.push("/");
    }, 1500);
  };

  useEffect(() => {
    
    if (currentUser) {
      setLoading(false)
      console.log(currentUser)
      
    } else {
      history.push("/")
    }

    
  }, [currentUser, loading]);


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Welcome</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="welcome">
          <IonText>{`Logged in: ${currentUser?.email}`}</IonText>
          <IonButton onClick={() => history.push("/new")}>New List</IonButton>
          <IonButton onClick={() => history.push("/lists")}>Your Shopping lists</IonButton>
          <IonButton onClick={logOut}>Logout</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;

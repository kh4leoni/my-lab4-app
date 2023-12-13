import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonText,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonRouter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { Link, Route, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./Menu.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import SavedLists from "../pages/SavedLists";
import NewList from "../pages/NewList";

const Menu: React.FC = () => {
  const { currentUser } = useAuth();
  const history = useHistory();
  const [present, dismiss] = useIonLoading();
  const [loading, setLoading] = useState(true);
  const router = useIonRouter();

  useEffect(() => {
    if (currentUser) {
      setLoading(false);
    } else {
      router.push("/");
    }
  }, [currentUser, loading]);

  const logOut = async () => {
    await signOut(auth);
    present("Logging out...");
    setTimeout(() => {
      dismiss();
      history.push("/");
    }, 1500);
  };

  const navigateNewList = (e: any) => {
    e.preventDefault();
    router.push("/new");
  };

  const navigateLists = (e: any) => {
    router.push("/lists");
  };

  return (
    <IonMenu side="end" contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="menu-div">
          <IonText>{`Logged in: ${currentUser?.email}`}</IonText>
          <IonMenuToggle autoHide={false}>
            <IonButton className="menu-btn" onClick={navigateNewList}>
              New shopping list
            </IonButton>
          </IonMenuToggle>
          <IonMenuToggle autoHide={false}>
            <IonButton className="menu-btn" onClick={navigateLists}>
              Saved shopping lists
            </IonButton>
          </IonMenuToggle>
          <IonMenuToggle autoHide={false}>
            <IonButton className="menu-btn" onClick={logOut}>
              Logout
            </IonButton>
          </IonMenuToggle>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;

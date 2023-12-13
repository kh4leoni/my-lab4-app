import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAlert,
  IonBackButton,
  IonMenuButton,
  IonFabButton,
  IonMenu,
  IonButtons,
  IonText,
  useIonRouter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SavedLists.css";
import Menu from '../components/Menu'

import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "@firebase/firestore";
import { menuOutline, personAddOutline, personCircle, personOutline, saveOutline, trashBinOutline } from "ionicons/icons";

interface documentType {
  [key: string]: any;
}

const SavedLists: React.FC = () => {
  const history = useHistory();
  const router = useIonRouter()

  const [shoppingLists, setShoppingLists] = useState<documentType[]>([]);
  const [forceUpdate, setForceUpdate] = useState(false)
  const [isMounted, setIsMounted] = useState(false);

  const shoppingListsCollectionRef = collection(db, "shoppingLists");


  const { currentUser } = useAuth();
  const getLists = async () => {
    const data = await getDocs(shoppingListsCollectionRef);
    setShoppingLists(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    
  };

  useEffect(() => {
    
    if (!currentUser) {
      router.push("/")
    } else {
      getLists();
      setIsMounted(true)
    }
    
  }, [currentUser, router]);
  
  useEffect(() => {
    if (!isMounted) {
      return
    }
    getLists()
  },[currentUser, router])

  const showList = (id: string) => {
    router.push(`/lists/${id}`);
  };

  const deleteList = async (e: any, id: string) => {
    e.stopPropagation();


    const listDoc = doc(db, "shoppingLists", id);
    await deleteDoc(listDoc);
    getLists();
  };

  const addNewList = () => {
    router.push("/new")
  }


  return (
    <>
    
      <Menu />
      <IonPage id="main-content">

      <IonHeader>
        <IonToolbar>
          <div className="tool-bar-buttons">
  
          <IonTitle>Your shopping lists</IonTitle>
          </div>
         
          <IonButtons slot="end">
         
            <IonMenuButton>
        
              <IonIcon icon={menuOutline}/>
            </IonMenuButton>
            
          </IonButtons>
          
       
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="saved-lists">        
        <IonList>
          {shoppingLists.filter((list: any) => list.user === currentUser?.uid).map((list) => (
            <IonItem onClick={() => showList(list.id)} button key={list.id}>
              {list.name}
              <IonButton
                slot="end"
                onClick={(e: any) => deleteList(e, list.id)}
              >
                Delete
              </IonButton>
            </IonItem>
          ))}
        </IonList>
        <IonButton className="add-new-button" expand="block" onClick={addNewList}>Add new shopping list</IonButton>
        </div>
      </IonContent>
    </IonPage>
    </>
   
  );
};

export default SavedLists;

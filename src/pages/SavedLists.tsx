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
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SavedLists.css";

import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "@firebase/firestore";
import { saveOutline, trashBinOutline } from "ionicons/icons";

interface documentType {
  [key: string]: any;
}

const SavedLists: React.FC = () => {
  const history = useHistory();

  const [shoppingLists, setShoppingLists] = useState<documentType[]>([]);

  const shoppingListsCollectionRef = collection(db, "shoppingLists");

  const { currentUser } = useAuth();

  const getLists = async () => {
    const data = await getDocs(shoppingListsCollectionRef);
    setShoppingLists(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    if (!currentUser) {
      history.push("/")
    }
    getLists();
  }, []);

  const showList = (id: string) => {
    history.push(`/lists/${id}`);
  };

  const deleteList = async (e: any, id: string) => {
    e.stopPropagation();

    alert("are you sure?")

    const listDoc = doc(db, "shoppingLists", id);
    await deleteDoc(listDoc);

    getLists();
  };

  const addNewList = () => {
    history.push("/new")
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="toolbar-buttons">
          <IonBackButton></IonBackButton>
          <IonTitle>Your shopping lists</IonTitle>
          </div>
       
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
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
        
      </IonContent>
    </IonPage>
  );
};

export default SavedLists;

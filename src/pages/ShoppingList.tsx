import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFabButton,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonRouter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import "./NewList.css";
import { useToast } from "../hooks/useToast";
import {
  addCircleOutline,
  addCircleSharp,
  list,
  logOut,
  menuOutline,
  saveOutline,
  trashOutline,
} from "ionicons/icons";
import { Redirect } from "react-router";

import { useAuth } from "../context/AuthContext";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { arrayUnion } from "firebase/firestore";

import { db } from "../../firebase";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
  DocumentData,
  DocumentReference,
  setDoc,
} from "@firebase/firestore";
import Menu from "../components/Menu";

type ShoppinListProps = {
  id: string;
};

interface documentType {
  [key: string]: any;
}

const ShoppingList: React.FC<ShoppinListProps> = ({ id }) => {
  const [newItem, setNewItem] = useState("");
  const [listName, setListName] = useState("");
  const [items, setItems] = useState<documentType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const itemsCollectionRef = collection(db, "items");
  const shoppingListsCollectionRef = collection(db, "shoppingLists");

  let nameOfTheList;

  const generateID = () => {
    const randomNum = Math.floor(Math.random() * 100000000);
    return randomNum.toString();
  };

  const getItems = async (id: string) => {
    const listDoc = doc(db, "shoppingLists", id);
    const docSnap = await getDoc(listDoc);

    if (docSnap.exists()) {
      const data = docSnap.data() as DocumentData;

      nameOfTheList = data.name;

      setItems(data.list);
    }
  };

  useEffect(() => {
    getItems(id);
  }, []);

  const { currentUser } = useAuth();
  const router = useIonRouter();

  const toast = useToast();

  const [present, dismiss] = useIonLoading();

  useEffect(() => {}, [items]);

  const addItem = async (e: any) => {
    const listDoc = doc(db, "shoppingLists", id);
    const docSnap = await getDoc(listDoc);
    let updatedItems: documentType | any = [];

    if (newItem === "") {
      toast("Add valid item name", "top");
    } else {
      if (docSnap.exists()) {
        const data = docSnap.data() as DocumentData;

        updatedItems = items.concat({
          name: newItem,
          isDone: false,
          user: currentUser?.uid,
          id: generateID(),
        });

        const newField = { list: updatedItems };
        await updateDoc(listDoc, newField);

        setNewItem("");

        getItems(id);
      }
    }
  };

  const deleteItem = async (itemId: string) => {
    const listDoc = doc(db, "shoppingLists", id);
    const docSnap = await getDoc(listDoc);
    let updatedItems: documentType | any = [];

    if (docSnap.exists()) {
      const data = docSnap.data() as DocumentData;

      updatedItems = items.filter((item: any) => item.id !== itemId);

      const newField = { list: updatedItems };
      await updateDoc(listDoc, newField);

      getItems(id);
    } else {
      console.log("List not found.");
    }
  };

  const markAsDone = async (itemId: string) => {
    const listDoc = doc(db, "shoppingLists", id);
    const docSnap = await getDoc(listDoc);
    let updatedItems: documentType | any = [];

    if (docSnap.exists()) {
      updatedItems = items.map((item: any) =>
        item.id === itemId ? { ...item, isDone: !item.isDone } : item
      );
      const newField = { list: updatedItems };
      await updateDoc(listDoc, newField);
      getItems(id);
    } else {
      console.log("List not found");
    }
  };

  const logOut = async () => {
    await signOut(auth);
    present("Loggin out...");
    setTimeout(() => {
      dismiss();
      router.push("/");
    }, 1500);
    setNewItem("");
  };

  return (
    <>
    <Menu />
    <IonPage>
    <IonHeader>
        <IonToolbar className="tool-bar-chart">
          <div className="toolbar-buttons">
            <IonBackButton defaultHref="/lists"></IonBackButton>
            
          </div>
          <IonButtons slot="end"><IonMenuButton></IonMenuButton></IonButtons>
 
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" scrollY={false}>
        <IonGrid fixed>
          <IonRow class="ion-justify-content-center">
            <IonCol
              size="12"
              sizeMd="8"
              sizeLg="6"
              sizeXl="4"
              className="item-list"
            >
              <IonContent scrollY>
                <IonList className="item-lista">
                  {items?.map((item) => {
                    return (
                      <div className="list-items" key={item.id}>
                        {" "}
                        <IonItem
                          className={
                            item.isDone === false
                              ? "item-list-text"
                              : "item-list-text done-item"
                          }
                          onClick={() => markAsDone(item.id)}
                          lines="none"
                          key={item.id}
                        >
                          {item.name}
                        </IonItem>
                        <IonButton
                          fill="clear"
                          onClick={() => deleteItem(item.id)}
                        >
                          <IonIcon icon={trashOutline} />
                        </IonButton>
                      </div>
                    );
                  })}
                </IonList>
              </IonContent>
            </IonCol>
          </IonRow>
          <IonRow class="ion-align-items-flex-end">
            <IonCol
              size="12"
              sizeMd="8"
              sizeLg="6"
              sizeXl="4"
              className="add-item-field ion-padding"
            >
              <IonText>Add new items to the list</IonText>
              <div className="item-add">
                
                <IonInput
                  className="item-input-field"
                  type="text"                  
                  label="Type item name"
                  labelPlacement="floating"
                  clearOnEdit={true}
                  value={newItem}
                  onKeyUp={(e: any) => setNewItem(e.target.value)}
                />
                <IonFabButton className="user-button" onClick={addItem}>
                  <IonIcon icon={addCircleOutline} />
                </IonFabButton>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
    </>
    
  );
};

export default ShoppingList;

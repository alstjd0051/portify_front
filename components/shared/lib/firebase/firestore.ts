import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  DocumentData,
} from "firebase/firestore";
import { firestore } from "./config";

export const firestoreService = {
  // 문서 생성
  create: async <T extends DocumentData>(
    collectionName: string,
    id: string,
    data: T
  ) => {
    const docRef = doc(firestore, collectionName, id);
    await setDoc(docRef, data);
    return id;
  },

  // 문서 조회
  get: async <T>(collectionName: string, id: string) => {
    const docRef = doc(firestore, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as T) : null;
  },

  // 컬렉션 조회
  list: async <T>(collectionName: string) => {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  },

  // 문서 업데이트
  update: async <T>(collectionName: string, id: string, data: Partial<T>) => {
    const docRef = doc(firestore, collectionName, id);
    await updateDoc(docRef, data as any);
  },

  // 문서 삭제
  delete: async (collectionName: string, id: string) => {
    const docRef = doc(firestore, collectionName, id);
    await deleteDoc(docRef);
  },
};

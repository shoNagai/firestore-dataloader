import { firestore } from "firebase-admin";

export const getDocData = <T>(
  doc:
    | firestore.QueryDocumentSnapshot<firestore.DocumentData>
    | firestore.DocumentSnapshot<firestore.DocumentData>
): T & {
  id: string;
} => {
  return { ...(doc.data() as T), id: doc.id };
};

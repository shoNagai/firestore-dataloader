import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from "@google-cloud/firestore";

export const getDocData = <T>(
  doc: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>
): T & {
  id: string;
} => {
  return { ...(doc.data() as T), id: doc.id };
};

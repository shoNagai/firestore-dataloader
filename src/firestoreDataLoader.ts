import { DataSource } from "apollo-datasource";
import DataLoader, { Options } from "dataloader";
import { firestore } from "firebase-admin";
import { getDocData } from "./utils/getDocData";

/**
 * GraphQL DataLoader for Cloud Firestore.
 */
export default class FirestoreDataLoader<TDocument = any> extends DataSource {
  public dataLoader: DataLoader<string, TDocument & { id: string }, string>;

  /**
   * constructor
   * It is assumed to be declared as one of the dataSources.
   * @param baseQuery CollectionReference or Query
   * @param options DataLoader.Options. maxBatchSize is set to 10 due to firestore limitation.
   */
  constructor(
    baseQuery: firestore.CollectionReference | firestore.Query,
    options?:
      | Options<
          string,
          TDocument & {
            id: string;
          },
          string
        >
      | undefined
  ) {
    super();
    this.dataLoader = new DataLoader((ids) => this.loadDataByIds(baseQuery, ids), {
      ...options,
      // maximum of 10 firestore in clauses.
      maxBatchSize: 10,
    });
  }

  /**
   * load datas by ids
   * @param {firestore.CollectionReference | firestore.Query} baseQuery CollectionReference or Query
   * @param {string[]} ids
   * @returns documents
   */
  async loadDataByIds(
    baseQuery: firestore.CollectionReference | firestore.Query,
    ids: readonly string[]
  ): Promise<
    (TDocument & {
      id: string;
    })[]
  > {
    console.log("Call loadDataByIds", ids);
    const snaps = await baseQuery.where(firestore.FieldPath.documentId(), `in`, ids).get();
    if (snaps.empty) return [];
    const docs = snaps.docs.map((doc) => getDocData<TDocument>(doc));
    return docs.filter((doc) => ids.includes(doc.id));
  }
}

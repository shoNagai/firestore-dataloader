import { DataSource } from "apollo-datasource";
import DataLoader from "dataloader";
import { firestore } from "firebase-admin";
import { getDocData } from "./utils/getDocData";

/**
 * GraphQL DataLoader for Cloud Firestore.
 */
export default class FirestoreDataLoader<T> extends DataSource {
  public baseQuery: firestore.CollectionReference | firestore.Query;
  public userLoader: DataLoader<string, T & { id: string }, string>;

  /**
   * constructor
   * It is assumed to be declared as one of the dataSources.
   * @param baseQuery CollectionReference or Query
   */
  constructor(baseQuery: firestore.CollectionReference | firestore.Query) {
    super();
    this.baseQuery = baseQuery;
    // maximum of 10 firestore in clauses.
    this.userLoader = new DataLoader((ids) => this.loadDataByIds(ids), {
      maxBatchSize: 10,
    });
  }

  /**
   * load datas by ids
   * @param {string[]} ids
   * @returns {T} documents
   */
  async loadDataByIds(
    ids: readonly string[]
  ): Promise<
    (T & {
      id: string;
    })[]
  > {
    const snaps = await this.baseQuery
      .where(firestore.FieldPath.documentId(), `in`, ids)
      .get();
    const docs = snaps.docs.map((doc) => getDocData<T>(doc));
    return docs.filter((doc) => ids.includes(doc.id));
  }
}

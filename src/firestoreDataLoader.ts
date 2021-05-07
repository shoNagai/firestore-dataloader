import { DataSource } from "apollo-datasource";
import DataLoader, { Options } from "dataloader";
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
   * @param options DataLoader.Options. maxBatchSize is set to 10 due to firestore limitation.
   */
  constructor(
    baseQuery: firestore.CollectionReference | firestore.Query,
    options?:
      | Options<
          string,
          T & {
            id: string;
          },
          string
        >
      | undefined
  ) {
    super();
    this.baseQuery = baseQuery;
    this.userLoader = new DataLoader((ids) => this.loadDataByIds(ids), {
      ...options,
      // maximum of 10 firestore in clauses.
      maxBatchSize: 10,
    });
  }

  /**
   * load datas by ids
   * @param {string[]} ids
   * @returns documents
   */
  async loadDataByIds(
    ids: readonly string[]
  ): Promise<
    (T & {
      id: string;
    })[]
  > {
    const snaps = await this.baseQuery.select().where(firestore.FieldPath.documentId(), `in`, ids).get();
    const docs = snaps.docs.map((doc) => getDocData<T>(doc));
    return docs.filter((doc) => ids.includes(doc.id));
  }
}

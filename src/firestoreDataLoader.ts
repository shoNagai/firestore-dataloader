import { CollectionReference, FieldPath, Query } from "@google-cloud/firestore";
import { DataSource } from "apollo-datasource";
import DataLoader, { Options } from "dataloader";
import { getDocData } from "./utils/getDocData";

/**
 * GraphQL DataLoader for Cloud Firestore.
 */
export class FirestoreDataLoader<TDocument = any> extends DataSource {
  public dataLoader: DataLoader<string, (TDocument & { id: string }) | null>;

  /**
   * constructor
   * It is assumed to be declared as one of the dataSources.
   * @param baseQuery CollectionReference or Query
   * @param options DataLoader.Options. maxBatchSize is set to 10 due to firestore limitation.
   */
  constructor(
    baseQuery: CollectionReference | Query,
    options?:
      | Options<
          string,
          | (TDocument & {
              id: string;
            })
          | null,
          string
        >
      | undefined
  ) {
    super();
    this.dataLoader = new DataLoader((keys) => this.loadDataByKeys(baseQuery, keys), {
      ...options,
      // maximum of 10 firestore in clauses.
      maxBatchSize: 10,
    });
  }

  /**
   * load datas by keys
   * @param {CollectionReference | Query} baseQuery CollectionReference or Query
   * @param {string[]} keys
   * @returns documents
   */
  async loadDataByKeys(
    baseQuery: CollectionReference | Query,
    keys: readonly string[]
  ): Promise<
    (
      | (TDocument & {
          id: string;
        })
      | null
    )[]
  > {
    const snapshot = await baseQuery.where(FieldPath.documentId(), `in`, keys).get();
    if (snapshot.empty) return [];
    return keys.map((key) => {
      const doc = snapshot.docs.find((doc) => doc.id === key);
      return doc ? getDocData<TDocument>(doc) : null;
    });
  }
}

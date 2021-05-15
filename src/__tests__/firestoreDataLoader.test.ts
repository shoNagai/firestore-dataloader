import * as firebaseTesting from "@firebase/rules-unit-testing";
import { FirestoreDataLoader } from "../";

const PROJECT_ID = `apollo-server-with-firestore`;
const adminApp = firebaseTesting.initializeAdminApp({ projectId: PROJECT_ID });
const firestore = adminApp.firestore();

interface User {
  id: string;
  name: string;
}

const USERS: User[] = [
  {
    id: `1`,
    name: `tester1`,
  },
  {
    id: `2`,
    name: `tester2`,
  },
  {
    id: `3`,
    name: `tester3`,
  },
  {
    id: `4`,
    name: `tester4`,
  },
  {
    id: `5`,
    name: `tester5`,
  },
];

beforeEach(async () => {
  await firebaseTesting.clearFirestoreData({ projectId: PROJECT_ID });
});

afterEach(async () => {
  await firebaseTesting.clearFirestoreData({ projectId: PROJECT_ID });
});

afterAll(async () => {
  // firebaseとのlistnerを削除しないとテストが終了できない
  await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
});

describe("firestoreDataLoader test", () => {
  describe("load testing", () => {
    beforeEach(async () => {
      // add testing data
      const batch = firestore.batch();
      firestore.collection(`users`);
      USERS.map((user) => {
        batch.set(firestore.collection(`users`).doc(user.id), user);
      });
      await batch.commit();
    });
    test("default to ascending order by document ID.", async () => {
      const dataLoader = new FirestoreDataLoader<User>(firestore.collection(`users`) as any);

      const PromiseUsers = USERS.map((user) => {
        return dataLoader.dataLoader.load(user.id);
      });

      const users = await Promise.all(PromiseUsers);

      expect(users).toEqual(USERS);
    });
    test("items will be retrieved in the order of the keys you pass.", async () => {
      const dataLoader = new FirestoreDataLoader<User>(firestore.collection(`users`) as any);

      // sorted desc
      const sortedUsers = USERS.sort((a, b) => {
        return Number(b.id) - Number(a.id);
      });

      const PromiseUsers = sortedUsers.map((user) => {
        return dataLoader.dataLoader.load(user.id);
      });

      const users = await Promise.all(PromiseUsers);

      expect(users).toEqual(sortedUsers);
    });
  });
});

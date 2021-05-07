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
    test("load users", async () => {
      const dataLoader = new FirestoreDataLoader<User>(firestore.collection(`users`) as any);
      const Promise1 = dataLoader.dataLoader.load(USERS[0].id);
      const Promise2 = dataLoader.dataLoader.load(USERS[1].id);

      const [value1, value2] = await Promise.all([Promise1, Promise2]);

      expect(value1.name).toBe(USERS[0].name);
      expect(value2.name).toBe(USERS[1].name);
    });
  });
});

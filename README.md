# Firestore DataLoader

FirestoreDataLoader is a GraphQL DataLoader for Cloud Firestore.

## Getting Started

First, install FirestoreDataLoader using npm or yarn.

```sh
npm install --save firestore-dataloader
```

or

```sh
yarn add firestore-dataloader
```

## Usage

Initialize datasources by specifying a collection or query.

```js
import { FirestoreDataLoader } from 'firestore-dataloader';

usersDataLoader: new FirestoreDataLoader<User>(db.collection(`users`)),

```

The second argument can optionally declare the DataLoader options.
For more information on how to use the dataloader options, please refer to the [dataloader](https://github.com/graphql/dataloader) repository.

Resolver can receive and use data loaders from context.

```js
const Message: MessageResolvers = {
  async user(parent, _args, { dataSources: { usersDataLoader } }) {
    const user = await usersDataLoader.dataLoader.load(parent.id);
    if (!user) throw new ApolloError(`no user userId: ${parent.id}`);
    return userToGQL(user);
  },
};
```

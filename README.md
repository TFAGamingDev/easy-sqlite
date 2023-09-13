<h1 align="center"> @tfadev/easy-sqlite</h1>

<p align="center">
    <img src="https://img.shields.io/discord/918611797194465280?color=7289da&logo=discord&logoColor=white&label=Discord">
    <img src="https://img.shields.io/npm/v/@tfadev/easy-sqlite.svg?maxAge=3600&logo=npm">
    <img src="https://img.shields.io/npm/dt/@tfadev/easy-sqlite.svg?maxAge=3600&label=Downloads">
</p>

SQlite3 database but simplified with easy methods and TypeScript support!

## Features
- Supports string arrays only (other types aren't supported yet).
- Supports boolean values.
- Simple and easy to use.
- Poweful typings.

## Installation
```sh-session
npm install @tfadev/discord.js-docs axios
```

## Usage

Create a new database using the class `SQLiteDatabase`:

```ts
import { SQLiteDatabase } from '@tfadev/easy-sqlite';

const db = new SQLiteDatabase('path/to/your/sql/file.db');
```

Here are the available methods to use.

> **Note**
> Every key is required (**NOT NULL**), you can make one or some of them optional by adding `{ nullable: true }`.

```ts
// Creates a new table:
await db.create({
    {
        name: 'users',
        overwrite: true, // IF EXISTS
        keys: {
            id: ['INTEGER', {
                primary: true, // PRIMARY KEY
                autoincrement: true // AUTOINCREMENT
            }],
            username: ['TEXT'],
            age: ['INTEGER'],
            alive: ['BOOLEAN', {
                nullable: true
            }],
            languages: ['ARRAY']
        }
    }
});

// Deletes a table:
await db.drop('users', ...);

// Insert a new row in a table:
await db.insert('users', {
    username: 'T.F.A',
    age: 17,
    alive: true,
    languages: ['Python', 'Typescript', 'C++']
});

// Select from a table:
await db.select('users'); // → [{ ... }]

await db.select('users', { username: 'T.F.A' }); // → [{ ... }]
await db.select('users', { age: 17 }); // → [{ ... }]
await db.select('users', { username: 'T.F.A', age: 19 }); // → []

// Ensure if a table exist or not:
await db.ensure('users'); // → true

await db.ensure('users', { username: 'T.F.A' }); // → true
await db.ensure('users', { age: 17 }); // → true
await db.ensure('users', { username: 'T.F.A', age: 19 }); // → false

// Deletes a row from a table:
await db.delete('users', { username: 'T.F.A' });
```

## Typings

The class has a type parameter, it serves for the typings of each method, here is an example:

```ts
type Schema = {
    name: 'users',
    keys: {
        username: string,
        age: number,
        alive?: boolean,
        languages: string[]
    }
};

const db = new SQLiteDatabase<Schema>(...);
```

## License
**GNU General Public License** ([View here](./LICENSE))
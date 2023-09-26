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
npm install @tfadev/easy-sqlite
```

## Usage

Create a new database using the class `SQLiteDatabase`:

```ts
import { SQLiteDatabase } from '@tfadev/easy-sqlite';

const db = new SQLiteDatabase('path/to/your/file.db');
```

Here are the available methods to use with `SQLiteDatabase` class.

> **Note**
> Every key is required (**NOT NULL**), you can make one or some of them optional by adding `{ nullable: true }`.

```ts
// Creates a new table:
await db.create({
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
});

// Insert a new row in a table:
await db.insert('users', {
    username: 'John',
    age: 35,
    alive: true,
    languages: ['Python', 'Typescript', 'C++']
});

// Select from a table:
await db.select('users'); // → [{ ... }]

await db.select('users', { username: 'John' }); // → [{ ... }]
await db.select('users', { age: 35 }); // → [{ ... }]
await db.select('users', { username: 'John', age: 40 }); // → []

// Ensure if a table exist or not, or by using filter:
await db.ensure('users'); // → true

await db.ensure('users', { username: 'John' }); // → true
await db.ensure('users', { age: 35 }); // → true
await db.ensure('users', { username: 'John', age: 40 });// → false

// Deletes a row from a table:
await db.delete('users', { username: 'John' });

// Deletes a table:
await db.drop('users');

// Close the database:
await db.close();
```

## Typings

The class has a type parameter with type of array, you can include many schemas as you want, just make sure the types are correct and equal to created tables.

```ts
type UsersSchema = {
    name: 'users',
    keys: {
        username: string,
        age: number,
        alive?: boolean, // ← Nullable
        languages: string[]
    }
};

new SQLiteDatabase<[UsersSchema, ...]>(...);
```

## License
**GNU General Public License** ([View here](./LICENSE))
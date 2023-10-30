<h1 align="center"> @tfadev/easy-sqlite</h1>

<p align="center">
    <img src="https://img.shields.io/discord/918611797194465280?color=7289da&logo=discord&logoColor=white&label=Discord">
    <img src="https://img.shields.io/npm/v/@tfadev/easy-sqlite.svg?maxAge=3600&logo=npm">
    <img src="https://img.shields.io/npm/dt/@tfadev/easy-sqlite.svg?maxAge=3600&label=Downloads">
</p>

SQlite3 database but simplified with easy methods, with TypeScript support!

## Features
- Supports arrays (string arras only).
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
import { TableType } from '@tfadev/easy-sqlite';

// Creates a new table:
await db.create({
    name: 'users',
    overwrite: true, // IF EXISTS
    keys: {
        id: [TableType.Integer, {
            primary: true, // PRIMARY KEY
            autoincrement: true // AUTOINCREMENT
        }],
        username: [TableType.String],
        age: [TableType.Integer],
        alive: [TableType.Boolean, {
                nullable: true
        }],
        languages: [TableType.Array]
    }
});

// Insert a new row in a table:
await db.insert('users', {
    username: 'John',
    age: 35,
    alive: true,
    languages: ['Python', 'Typescript', 'C++']
});

// Select from a table, in an array output:
await db.select('users');
await db.select('users', { username: 'John' });

// Select from a table, in single output:
await db.selectFirst('users');
await db.selectFirst('users', { username: 'John' });

// Ensure if it exists or not:
await db.ensure('users');
await db.ensure('users', { username: 'John' });

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
import sqlite3 from 'sqlite3';
import { DefaultValueType, TableStructureSQLiteTypes, TableStructureDefaultTypes } from '../types';

sqlite3.verbose();

const splitterChar = `\\/?!*^$£µ&@|øÎ▒ÿ`;

export class SQLiteDatabase<T extends TableStructureDefaultTypes[] = []> {
    public path: string;
    private readonly db: sqlite3.Database;

    constructor(path: `${string}.db`) {
        this.path = path;

        this.db = new sqlite3.Database(path, (err) => {
            if (err) throw new Error('Failed to create a new SQLite database.\n' + err);
        });
    };

    public create(...tables: TableStructureSQLiteTypes[]): Promise<this> {
        const codes: string[] = [];

        for (const table of tables) {
            const keys = [...Object.keys(table.keys)];

            if (keys.includes('name')) throw new Error('The name \'name\' is prohibited.');

            const arr: string[] = [];
            let primaryKeysCount = 0;

            for (const key of keys) {
                arr.push(`${key} ${(table.keys[key][0] !== 'INTEGER' && table.keys[key][1]?.autoincrement) ? 'INTEGER' : table.keys[key][0]} ${table.keys[key][1]?.primary && primaryKeysCount < 1 ? 'PRIMARY KEY' : ''} ${table.keys[key][1]?.autoincrement && table.keys[key][0] === 'INTEGER' ? 'AUTOINCREMENT' : ''}`);

                if (table.keys[key][1]?.primary) primaryKeysCount++;
            };

            if (primaryKeysCount <= 0) throw new Error('Required at least one primary column.');
            if (primaryKeysCount > 1) throw new Error('More than one primary key provided.');

            const code = `CREATE TABLE ${table.overwrite ? 'IF NOT EXISTS' : ''} ${table.name}(${arr.join(', ')})`
                .replace(/BOOLEAN|ARRAY/g, 'TEXT');

            codes.push(code);
        };

        return new Promise((res, rej) => {
            for (const code of codes) {
                this.db.run(code, (err) => {
                    if (err) return rej(err);

                    res(this);
                });
            };
        });
    };

    public drop<N extends T[number]['name'][]>(...names: N): Promise<this> {
        const codes: string[] = [];

        for (const name of names) {
            const code = `DROP TABLE ${name}`;

            codes.push(code);
        };

        return new Promise((res, rej) => {
            for (const code of codes) {
                this.db.run(code, (err) => {
                    if (err) return rej(err);

                    res(this);
                });
            };
        });
    };

    public ensure<N extends T[number]['name']>(name: N, where?: Partial<Extract<T[number], { name: N }>['keys']>): Promise<boolean> {
        const code = `SELECT name FROM sqlite_master WHERE type='table' AND name=?`;

        return new Promise((res, rej) => {
            this.db.get(code, [name], async (err, row: any[]) => {
                if (err) return rej(err)

                if (where) {
                    const selected = await this.select(name, where);

                    if (selected.length > 0) res(true); else res(false);
                } else {
                    if (row) res(true); else res(false);
                };
            });
        });
    };

    public insert<N extends T[number]['name']>(name: N, data: Extract<T[number], { name: N }>['keys']): Promise<this> {
        const keys = [...Object.keys(data)];
        const values = [...Object.values(data)];
        const newValues: any[] = [];

        for (const value of values) {
            if (typeof value === 'string' && (value === 'boolean-true' || value === 'boolean-false')) throw new Error('The method is not allowed.');

            if (typeof value === 'boolean') {
                newValues.push(`${value ? 'boolean-true' : 'boolean-false'}`);
            } else if (Array.isArray(value)) {
                newValues.push(`${value.length <= 0 ? `${splitterChar}` : (value.length === 1 ? `${value}${splitterChar}` : value.join(splitterChar))}`);
            } else newValues.push(value);
        };

        const code = `INSERT INTO ${name} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(',')})`;

        return new Promise((res, rej) => {
            this.db.run(code, newValues, (err) => {
                if (err) return rej(err);

                res(this);
            });
        });
    };

    public delete<N extends T[number]['name']>(name: N, where: Partial<Extract<T[number], { name: N }>['keys']>): Promise<this> {
        const arr = [];

        if (where) {
            const keys = [...Object.keys(where)];

            for (const key of keys) {
                if (key === 'name') continue;

                arr.push(`${key}=${typeof where[key] === 'string' ? `'${where[key]}'` : where[key]}`);
            };
        };

        const code = `DELETE FROM ${name} WHERE ${arr.join(' AND ')}`;

        return new Promise((res, rej) => {
            this.db.run(code, (err) => {
                if (err) return rej(err);

                res(this);
            });
        });
    };

    public select<N extends T[number]['name']>(name: N, where?: Partial<Extract<T[number], { name: N }>['keys']>): Promise<Extract<T[number], { name: N }>['keys'][]> {
        const arr = [];

        if (where) {
            const keys = [...Object.keys(where)];

            for (const key of keys) {
                if (key === 'name') continue;

                arr.push(`${key}=${typeof where[key] === 'string' ? `'${where[key]}'` : where[key]}`);
            };
        };

        const code = `SELECT * FROM ${name} ${arr.length > 0 ? `WHERE ${arr.join(' AND ')}` : ''}`;

        return new Promise((res, rej) => {
            this.db.all(code, [], (err, rows: any[]) => {
                if (err) return rej(err);

                const newRows: any[] = [];

                for (const row of rows) {
                    const stringified = JSON.stringify(row)
                        .replace(/"boolean-true"/g, 'true')
                        .replace(/"boolean-false"/g, 'false');

                    const parsed = JSON.parse(stringified);

                    const keys = [...Object.keys(parsed)];

                    let obj = parsed;

                    for (const key of keys) {
                        if (typeof obj[key] !== 'string') continue;

                        if (obj[key].includes(splitterChar)) {
                            let split = obj[key].split(splitterChar);

                            if (split[split.length - 1].length <= 0) split.pop();

                            obj[key] = split;
                        };
                    };

                    newRows.push(parsed);
                };

                res(newRows);
            });
        });
    };

    public selectFirst<N extends T[number]['name']>(name: N, where?: Partial<Extract<T[number], { name: N }>['keys']>): Promise<Extract<T[number], { name: N }>['keys'] | null> {
        return new Promise((res, rej) => {
            this.select(name, where)
                .then((arr) => {
                    arr.length <= 0 ? res(null) : res(arr[0]);
                })
                .catch(rej)
        });
    };

    public close(): Promise<this> {
        return new Promise((res, rej) => {
            this.db.close((err) => {
                if (err) return rej(err);

                res(this);
            });
        });
    };
};

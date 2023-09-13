export enum TableType {
    String = 'TEXT',
    Integer = 'INTEGER',
    Float = 'REAL',
    Boolean = 'BOOLEAN',
    Array = 'ARRAY'
};

export interface TableTypeInterface {
    'TEXT': string,
    'INTEGER': string,
    'REAL': string,
    'BOOLEAN': string,
    'ARRAY': string
};

export interface TableStructureSQLiteTypes {
    name: string,
    overwrite?: boolean,
    keys: {
        [key: string]: [
            type: SQLiteValueType,
            options?: {
                nullable?: boolean,
                primary?: boolean,
                autoincrement?: boolean
            }
        ]
    }
};

export interface TableStructureDefaultTypes {
    name: string,
    overwrite?: boolean,
    keys: {
        [key: string]: DefaultValueType
    }
};

export type SQLiteValueType = TableType | keyof TableTypeInterface;
export type DefaultValueType = string | number | bigint | boolean | null | string[];

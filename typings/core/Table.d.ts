import { TableStructureSQLiteTypes } from "../types";
export declare class Table {
    readonly structure: TableStructureSQLiteTypes;
    constructor(structure: TableStructureSQLiteTypes);
    toJSON(): TableStructureSQLiteTypes;
}

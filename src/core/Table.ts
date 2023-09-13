import { TableStructureSQLiteTypes } from "../types";

export class Table {
    public readonly structure: TableStructureSQLiteTypes;

    constructor(structure: TableStructureSQLiteTypes) {
        this.structure = structure;
    };

    public toJSON(): TableStructureSQLiteTypes {
        return {
            ...this.structure
        };
    };
};
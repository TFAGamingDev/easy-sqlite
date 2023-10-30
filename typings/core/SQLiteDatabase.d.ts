import { TableStructureSQLiteTypes, TableStructureDefaultTypes } from '../types';
export declare class SQLiteDatabase<T extends TableStructureDefaultTypes[] = []> {
    path: string;
    private readonly db;
    constructor(path: `${string}.db`);
    create(...tables: TableStructureSQLiteTypes[]): Promise<this>;
    drop<N extends T[number]['name'][]>(...names: N): Promise<this>;
    ensure<N extends T[number]['name']>(name: N, where?: Partial<Extract<T[number], {
        name: N;
    }>['keys']>): Promise<boolean>;
    insert<N extends T[number]['name']>(name: N, data: Extract<T[number], {
        name: N;
    }>['keys']): Promise<this>;
    delete<N extends T[number]['name']>(name: N, where: Partial<Extract<T[number], {
        name: N;
    }>['keys']>): Promise<this>;
    select<N extends T[number]['name']>(name: N, where?: Partial<Extract<T[number], {
        name: N;
    }>['keys']>): Promise<Extract<T[number], {
        name: N;
    }>['keys'][]>;
    selectFirst<N extends T[number]['name']>(name: N, where?: Partial<Extract<T[number], {
        name: N;
    }>['keys']>): Promise<Extract<T[number], {
        name: N;
    }>['keys'] | null>;
    close(): Promise<this>;
}

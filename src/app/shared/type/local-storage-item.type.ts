export type LocalStorageItem<T> = {
    timestamp: number;
    id: string;
    data: T
}
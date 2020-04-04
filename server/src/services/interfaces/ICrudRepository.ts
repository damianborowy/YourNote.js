import { Types } from "mongoose";

interface ICrudRepository<T> {
    create(obj: T): Promise<T>;

    read(id?: string): Promise<T[]>;

    update(obj: T): Promise<T>;

    delete(id: string): Promise<boolean>;
}

export default ICrudRepository;

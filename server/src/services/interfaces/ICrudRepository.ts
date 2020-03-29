import { Types } from "mongoose";

interface ICrudRepository<T> {
    create(obj: T): Promise<T>;

    read(id?: Types.ObjectId): Promise<T[]>;

    update(obj: T): Promise<T>;

    delete(id: Types.ObjectId): Promise<boolean>;
}

export default ICrudRepository;

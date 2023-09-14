
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum SortOrder {
    asc = "asc",
    desc = "desc"
}

export class Sort {
    firstName?: Nullable<SortOrder>;
    lastName?: Nullable<SortOrder>;
    email?: Nullable<SortOrder>;
    createdAt?: Nullable<SortOrder>;
}

export class Filter {
    equals?: Nullable<string>;
    in?: Nullable<Nullable<string>[]>;
    notIn?: Nullable<Nullable<string>[]>;
    lt?: Nullable<string>;
    lte?: Nullable<string>;
    gt?: Nullable<string>;
    gte?: Nullable<string>;
    contains?: Nullable<string>;
    startsWith?: Nullable<string>;
    endsWith?: Nullable<string>;
}

export class Where {
    firstName?: Nullable<Filter>;
    lastName?: Nullable<Filter>;
    email?: Nullable<Filter>;
}

export class NewUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export class UpdateUser {
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    email?: Nullable<string>;
    password?: Nullable<string>;
}

export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export abstract class IQuery {
    abstract getUser(id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract listUsers(sort?: Nullable<Sort[]>, where?: Nullable<Where[]>): User[] | Promise<User[]>;
}

export abstract class IMutation {
    abstract createUser(data?: Nullable<NewUser>): User | Promise<User>;

    abstract updateUser(id?: Nullable<string>, data?: Nullable<UpdateUser>): Nullable<User> | Promise<Nullable<User>>;

    abstract deleteUser(id?: Nullable<string>): Nullable<User> | Promise<Nullable<User>>;
}

type Nullable<T> = T | null;

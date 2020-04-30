export default class Note {
    constructor(
        public _id: string,
        public color: string,
        public owner: string,
        public date: Date,
        public isPublic: boolean,
        public title?: string,
        public content?: string,
        public tags?: string[],
        public sharedTo?: string[],
        public wasJustCreated?: boolean
    ) {}
}

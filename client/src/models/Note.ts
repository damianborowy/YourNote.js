export default class Note {
    constructor(
        public _id?: string,
        public title?: string,
        public content?: string,
        public color?: string,
        public owner?: string,
        public date?: Date,
        public tags?: string[],
        public sharedTo?: string[],
        public isPublic?: boolean,
        public wasJustCreated?: boolean
    ) {}
}

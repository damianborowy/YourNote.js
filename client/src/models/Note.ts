export default class Note {
    constructor(
        public _id?: string,
        public title?: string,
        public content?: string,
        public color?: number,
        public ownerId?: string,
        public date?: Date,
        public tags?: string,
        public sharedTo?: string[]
    ) {}
}

export default class FilterSettings {
    constructor(
        public selectedColors: string[],
        public titles: boolean,
        public contents: boolean,
        public tags: boolean
    ) {}

    public copy(): FilterSettings {
        return new FilterSettings(
            [...this.selectedColors],
            this.titles,
            this.contents,
            this.tags
        );
    }
}

import React, { useState, useEffect } from "react";
import styles from "./StatsTab.module.scss";
import Note from "../../../models/Note";
import adminApi from "../../../apis/AdminAPI";
import _ from "lodash";

const colorTab = [
    "Transparent",
    "Red",
    "Green",
    "Blue",
    "Gray",
    "Yellow",
    "Orange"
];

type TagInfo = {
    tag: string;
    count: number;
};

type ColorInfo = {
    color: string;
    count: number;
};

const StatsTab = () => {
    const [notes, setNotes] = useState<Note[] | null>(null),
        [selectedType, setSelectedType] = useState("Colors"),
        [topTags, setTopTags] = useState(null);

    useEffect(() => {
        (async () => {
            const result = await adminApi.readAllNotes();

            const notes = result.payload as Note[];
            setNotes(notes);

            console.log(calculateColors(notes));
        })();
    }, []);

    const calculateTopTags = (notes: Note[]): TagInfo[] => {
        const allTags = notes.map((note) => note.tags).flat() as string[];
        const tagOccurences = _.countBy(allTags);
        const sortedTopTags: TagInfo[] = _.chain(tagOccurences)
            .map((value, key) => {
                return { tag: key, count: value };
            })
            .sortBy("count")
            .reverse()
            .keyBy("tag")
            .mapValues("count")
            .toPairs()
            .value()
            .map((pair) => {
                return { tag: pair[0], count: pair[1] };
            })
            .slice(0, 10);

        return sortedTopTags;
    };

    const calculateColors = (notes: Note[]): ColorInfo[] => {
        const allColors = notes.map((note) => note.color);
        const colorOccurences = _.countBy(allColors);
        const sortedColors: ColorInfo[] = _.chain(colorOccurences)
            .map((value, key) => {
                return { color: key, count: value };
            })
            .sortBy("count")
            .reverse()
            .keyBy("tag")
            .mapValues("count")
            .toPairs()
            .value()
            .map((pair) => {
                return { color: pair[0], count: pair[1] };
            })
            .slice(0, 10);

        return sortedColors;
    };

    return <div className={styles.content}></div>;
};

export default StatsTab;

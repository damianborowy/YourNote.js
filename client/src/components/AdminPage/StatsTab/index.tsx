import React, { useState, useEffect } from "react";
import styles from "./StatsTab.module.scss";
import Note from "../../../models/Note";
import adminApi from "../../../apis/AdminAPI";
import _ from "lodash";
import { BarChart, XAxis, YAxis, Bar } from "recharts";
import { Button, Typography } from "@material-ui/core";

type DataPoint = {
    name: string;
    count: number;
};

const StatsTab = () => {
    const [selectedType, setSelectedType] = useState("Colors"),
        [colors, setColors] = useState<DataPoint[] | null>(null),
        [topTags, setTopTags] = useState<DataPoint[] | null>(null);

    useEffect(() => {
        (async () => {
            const result = await adminApi.readAllNotes();
            const notes = result.payload as Note[];

            setColors(calculateColors(notes));
            setTopTags(calculateTopTags(notes));
        })();
    }, []);

    const calculateTopTags = (notes: Note[]): DataPoint[] => {
        const allTags = notes.map((note) => note.tags).flat() as string[];
        const tagOccurences = _.countBy(allTags);

        return _.chain(tagOccurences)
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
                return { name: pair[0], count: pair[1] };
            })
            .slice(0, 10);
    };

    const calculateColors = (notes: Note[]): DataPoint[] => {
        const allColors = notes.map((note) => note.color);
        const colorOccurences = _.countBy(allColors);

        return _.chain(colorOccurences)
            .map((value, key) => {
                return { color: key, count: value };
            })
            .sortBy("count")
            .reverse()
            .keyBy("color")
            .mapValues("count")
            .toPairs()
            .value()
            .map((pair) => {
                return {
                    name: pair[0].charAt(0) + pair[0].slice(1).toLowerCase(),
                    count: pair[1]
                };
            });
    };

    const getData = () => {
        if (!colors || !topTags) return [];

        return selectedType === "Colors" ? colors : topTags;
    };

    return (
        <div className={styles.content}>
            <div>
                <h4 className={styles.chartHeader}>{selectedType}</h4>
                <BarChart width={1000} height={350} data={getData()}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="count" fill="#2196f3" />
                </BarChart>
            </div>
            <div className={styles.toggles}>
                <Typography>Toggle display type:</Typography>
                <Button
                    variant="outlined"
                    color={selectedType === "Colors" ? "primary" : "default"}
                    onClick={() => setSelectedType("Colors")}
                >
                    Colors
                </Button>
                <Button
                    variant="outlined"
                    color={selectedType === "Tags" ? "primary" : "default"}
                    onClick={() => setSelectedType("Tags")}
                >
                    Tags
                </Button>
            </div>
        </div>
    );
};

export default StatsTab;

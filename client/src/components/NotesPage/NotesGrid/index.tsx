import React, { useState, useEffect } from "react";
import NoteModel from "../../../models/Note";
import { Typography, useTheme } from "@material-ui/core";
import Note from "./Note";
import styles from "./NotesGrid.module.scss";
import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap
} from "react-grid-dnd";
import { getEmailFromToken } from "../../../utils/TokenHandler";
import useWindowDimensions from "../../../utils/useWindowDimensions";
import ViewModel from "../../../models/View";

interface INotesGridProps {
    notes: NoteModel[];
    originalNotes: NoteModel[];
    setOriginalNotes: (notes: NoteModel[]) => void;
    deleteNoteFromList: (note: NoteModel) => void;
    name: string;
    dndSetter: (notes: NoteModel[]) => void;
    views: ViewModel[] | null;
    setViews: (views: ViewModel[]) => void;
    selectedView: ViewModel | null;
    setSelectedView: (selectedView: ViewModel) => void;
}

const NotesGrid = (props: INotesGridProps) => {
    const theme = useTheme(),
        [boxesPerRow, setBoxesPerRow] = useState(1),
        { width } = useWindowDimensions();

    useEffect(() => {
        let newBoxes = 1;

        if (width > 350) newBoxes++;
        if (width > 600) newBoxes++;
        if (width > 1000) newBoxes++;

        setBoxesPerRow(newBoxes);
    }, [width]);

    const handleDNDGridChange = (
        sourceId: string,
        sourceIndex: number,
        targetIndex: number,
        targetId?: string
    ) => {
        if (!props.views || !props.selectedView) return;

        const viewCopy = { ...props.selectedView };
        const viewsCopy = [...props.views];

        const nextState = swap(viewCopy.notes, sourceIndex, targetIndex);
        const viewIndex = props.views.findIndex(
            (view) => view.name === props.selectedView!.name
        );
        viewCopy.notes = nextState;
        viewsCopy[viewIndex].notes = nextState;

        props.setSelectedView(viewCopy);
        props.setViews(viewsCopy);
    };

    const filterNotes = (notes: NoteModel[]) => {
        if (props.name === "My notes") {
            return notes
                .filter((note) => note !== undefined)
                .filter((note) => note.owner === getEmailFromToken());
        } else {
            return notes
                .filter((note) => note !== undefined)
                .filter((note) => note.owner !== getEmailFromToken());
        }
    };

    return (
        <>
            {filterNotes(props.notes).length !== 0 && (
                <div id="note" className={styles.container}>
                    <Typography
                        variant="h6"
                        style={{ color: theme.palette.text.primary }}
                        className={styles.typography}
                    >
                        {props.name}
                    </Typography>
                    <GridContextProvider onChange={handleDNDGridChange}>
                        <GridDropZone
                            id="items"
                            boxesPerRow={boxesPerRow}
                            rowHeight={228}
                            style={{
                                height:
                                    228 *
                                    Math.ceil(props.notes.length / boxesPerRow)
                            }}
                        >
                            {filterNotes(props.notes).map((note) => {
                                return (
                                    <GridItem
                                        key={note._id}
                                        style={{
                                            padding: "0 3px"
                                        }}
                                    >
                                        <Note
                                            model={note}
                                            originalNotes={props.originalNotes}
                                            setOriginalNotes={
                                                props.setOriginalNotes
                                            }
                                            deleteNoteFromList={
                                                props.deleteNoteFromList
                                            }
                                            views={props.views}
                                            setViews={props.setViews}
                                            selectedView={props.selectedView}
                                            setSelectedView={
                                                props.setSelectedView
                                            }
                                        />
                                    </GridItem>
                                );
                            })}
                        </GridDropZone>
                    </GridContextProvider>
                </div>
            )}
        </>
    );
};

export default NotesGrid;

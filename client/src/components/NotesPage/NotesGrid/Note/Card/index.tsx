import React from "react";
import styles from "./Card.module.scss";
import {
    Card as MaterialCard,
    CardContent,
    Typography,
    useTheme,
    CardActions,
    IconButton
} from "@material-ui/core";
import clsx from "clsx";
import NoteModel from "../../../../../models/Note";
import {
    LocalOffer as Tag,
    AttachFile,
    ZoomIn,
    MoreVert
} from "@material-ui/icons";

interface ICardProps {
    openDialog: () => void;
    note: NoteModel;
}
const Card = ({ note, openDialog }: ICardProps) => {
    const theme = useTheme();

    return (
        <MaterialCard
            id="card"
            className={clsx(
                styles.card,
                theme.palette.type || "light",
                note.color?.toLowerCase()
            )}
            variant="outlined"
        >
            <CardContent className={styles.cardContent}>
                <Typography
                    component="span"
                    variant="body1"
                    style={{
                        fontWeight: "bold"
                    }}
                >
                    {note.title}
                </Typography>
                <Typography>{note.content}</Typography>
            </CardContent>
            <CardActions className={styles.cardActions}>
                {note.tags && note.tags.length > 0 && (
                    <div className={styles.action}>
                        <Tag fontSize="small" />
                        <Typography className={styles.typography}>
                            {note.tags!.length}
                        </Typography>
                    </div>
                )}
                {note.files && note.files.length > 0 && (
                    <div className={styles.action}>
                        <AttachFile fontSize="small" />
                        <Typography className={styles.typography}>
                            {note.files!.length}
                        </Typography>
                    </div>
                )}
                <div className={styles.rightActions}>
                    <IconButton onClick={console.log}>
                        <MoreVert fontSize="small" />
                    </IconButton>
                    <IconButton onClick={openDialog}>
                        <ZoomIn fontSize="small" />
                    </IconButton>
                </div>
            </CardActions>
        </MaterialCard>
    );
};

export default Card;

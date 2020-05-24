import React, { useState } from "react";
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
import ViewModel from "../../../../../models/View";
import CardMenu from "./CardMenu";

interface ICardProps {
    openDialog: () => void;
    note: NoteModel;
    handleNoteChange: (note: NoteModel) => void;
    views: ViewModel[] | null;
    setViews: (views: ViewModel[]) => void;
    selectedView: ViewModel | null;
    setSelectedView: (selectedView: ViewModel) => void;
}
const Card = (props: ICardProps) => {
    const theme = useTheme(),
        [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuClose = () => setAnchorEl(null);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) =>
        setAnchorEl(event.currentTarget);

    const { note } = props;

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
                    <IconButton onClick={handleMenuClick}>
                        <MoreVert fontSize="small" />
                    </IconButton>
                    <IconButton onClick={props.openDialog}>
                        <ZoomIn fontSize="small" />
                    </IconButton>
                </div>
            </CardActions>
            <CardMenu
                note={props.note}
                views={props.views}
                setViews={props.setViews}
                selectedView={props.selectedView}
                setSelectedView={props.setSelectedView}
                anchorEl={anchorEl}
                handleClose={handleMenuClose}
            />
        </MaterialCard>
    );
};

export default Card;

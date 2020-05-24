import React from "react";
import styles from "./ViewSettings.module.scss";
import ViewModel from "../../../../models/View";

interface IViewSettingsProps {
    views: ViewModel[] | null;
    setViews: (views: ViewModel[]) => void;
    selectedView: ViewModel | null;
    setSelectedView: (view: ViewModel) => void;
}

const ViewSettings = (props: IViewSettingsProps) => {
    return <h1>Foo</h1>;
};

export default ViewSettings;

// GroupDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";
import Overview from "./Overview/Overview";

const GroupDetails = () => {
    const { groupId } = useParams(); // reads :groupId from /details/:groupId
    return <Overview groupId={groupId} />;
};

export default GroupDetails;

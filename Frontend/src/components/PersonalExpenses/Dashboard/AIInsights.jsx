import React from "react";
import "./Dashboard.css";

const AIInsights = ({ expenses }) => {
    return (
        <div className="glass-card ai-insights">
            <h2>AI Financial Insights</h2>
            <p>
                Transportation costs have increased. Consider carpooling or public
                transit options.
            </p>
        </div>
    );
};

export default AIInsights;

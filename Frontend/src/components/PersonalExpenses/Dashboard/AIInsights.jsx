import React from "react";
import "./Dashboard.css";

const AIInsights = ({ expenses }) => {
    return (
        <div className="ai-insights-card">
            <div className="ai-insights-header">
                <div className="ai-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor" />
                    </svg>
                </div>
                <h2>AI Financial Insights</h2>
            </div>
            <p>
                Transportation costs have increased. Consider carpooling or public
                transit options.
            </p>
        </div>
    );
};

export default AIInsights;

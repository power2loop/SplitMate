import { ArrowLeft } from "lucide-react";
import React from "react";

import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>

      <h2 className="notfound-subtitle">Page Not Found</h2>

      <p className="notfound-text">
        Sorry, we couldn't find the page you're looking for. Let's get you back to splitting
        expenses!
      </p>

      <a href="/landingpage" className="btn btn-primary notfound-link">
        <ArrowLeft className="icon" />
        <span>Back to Home</span>
      </a>
    </div>
  );
};

export default NotFound;

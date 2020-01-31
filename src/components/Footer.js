import React from "react";

function Footer() {
  return (
    <div
      style={{
        position: "fixed",
        right: "0px",
        bottom: "0px",
        textAlign: "center",
        backgroundColor: "rgba(255,255,255,0.0)",
        padding: "0.5rem 0.3rem 0.2rem 0.8rem",
        borderTopLeftRadius: "16px",
        color: "white"
      }}
    >
      <a
        style={{ textDecoration: "none", color: "white" }}
        href="https://lab.eyecandycode.com"
      >
        Back to EyeCandyCode...
      </a>
    </div>
  );
}

export default Footer;

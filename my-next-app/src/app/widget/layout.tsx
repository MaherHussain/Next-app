import React from "react";
import "./widget.css";

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="widget-container antialiased">
      {children}
    </div>
  );
}

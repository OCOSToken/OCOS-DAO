// InfoBanner.js
import React from "react";
import { AlertCircle, Info, Sparkles } from "lucide-react";

export default function InfoBanner({ type = "info", title, message }) {
  // Banner color and icon logic based on type
  const getBannerStyle = () => {
    switch (type) {
      case "success":
        return "bg-emerald-600/80 border-emerald-300";
      case "error":
        return "bg-rose-700/80 border-rose-400";
      case "warning":
        return "bg-yellow-500/80 border-yellow-300";
      default:
        return "bg-sky-900/80 border-sky-400";
    }
  };
  const getIcon = () => {
    switch (type) {
      case "success":
        return <Sparkles className="w-5 h-5 mr-2" />;
      case "error":
        return <AlertCircle className="w-5 h-5 mr-2" />;
      case "warning":
        return <Info className="w-5 h-5 mr-2 text-yellow-200" />;
      default:
        return <Info className="w-5 h-5 mr-2" />;
    }
  };

  return (
    <div className={`flex items-center rounded-2xl border p-4 shadow-xl mb-4 ${getBannerStyle()}`}>
      {getIcon()}
      <div>
        {title && <div className="font-bold text-lg mb-1">{title}</div>}
        <div className="text-base">{message}</div>
      </div>
    </div>
  );
}

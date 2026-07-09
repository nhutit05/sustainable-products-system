import { Tag } from "antd";
import type { DocumentStatus } from "../types/knowledge";

export const formatFileSize = (bytes: number): string => {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB"];

  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

export const getStatusColor = (
  status: DocumentStatus
): string => {
  switch (status) {
    case "UPLOADED":
      return "orange";

    case "PARSED":
      return "blue";

    case "CHUNKED":
      return "cyan";

    case "EMBEDDED":
      return "green";

    case "FAILED":
      return "red";

    default:
      return "default";
  }
};

export const renderStatusTag = (
  status: DocumentStatus
) => {
  return (
    <Tag color= {getStatusColor(status)}>
      {status}
    </Tag>
  );
};
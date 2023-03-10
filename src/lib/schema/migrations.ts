import { migrateLayoutDataFromV1 } from "./v2";

export const migrateLayoutData = (
  from: number,
  to: number,
  customData: any
) => {
  if (from === 1 && to === 2) {
    return migrateLayoutDataFromV1(customData);
  }
  throw new Error(`migrateLayoutData: unsupported migration: ${from} -> ${to}`);
};

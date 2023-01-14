import { exportDotIoCSV, parseDotIoImportCSV } from "$lib/parsers/dot-io";
import { migrateLayoutData } from "$lib/schema/migrations";
import {
  v2Both,
  v2LayoutData,
  type DefaultLayer,
  type JoystickInput,
  type LayoutData,
  type Stick,
} from "$lib/schema/v2";
import type { Writable } from "svelte/store";

export const exportData = (
  type: "self" | "dot-io",
  customData: LayoutData,
  latest: LayoutData["history"][number] | null
) => {
  const a = document.createElement("a");
  if (type === "self") {
    a.href =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(customData, null, 2));
    a.download = "cc-layouts-export.json";
  } else {
    if (!latest) return;
    a.href =
      "data:text/csv;charset=utf-8," +
      encodeURIComponent(exportDotIoCSV(latest.state));
    a.download = "cc-layouts-export.csv";
  }
  a.click();
};

export const importData = (type: "self" | "dot-io", customData: LayoutData) => {
  if (
    !confirm(
      "Are you sure you want to import a layout? This will overwrite your current layout."
    )
  )
    return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = type === "self" ? "application/json" : "text/csv";
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (text && type === "self") {
          const obj = JSON.parse(text as string);
          console.log("importing data", obj);
          const parsed = v2LayoutData.safeParse(obj);
          if (parsed.success) {
            customData = parsed.data;
          } else {
            const parsed = migrateLayoutData(1, 2, obj);
            if (parsed.success) {
              customData = parsed.data;
            } else {
              alert("Invalid file");
              console.error(parsed.error);
            }
          }
        }

        if (text && type === "dot-io") {
          const parsed = parseDotIoImportCSV(text.toString());
          if (parsed.success) {
            customData = {
              ...customData,
              history: [
                ...customData.history,
                {
                  index: customData.history.length,
                  modifiedOn: new Date().toISOString(),
                  state: parsed.data,
                },
              ],
            };
          } else {
            alert("Invalid file");
            console.error(parsed.error);
          }
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
};

export const handleSave = (
  {
    detail,
  }: CustomEvent<{
    input: JoystickInput;
    stick: Stick;
    half: "left" | "right";
    value: string;
  }>,
  customData: Writable<LayoutData>,
  $selectedLayer: DefaultLayer
) => {
  customData.update(($customData: LayoutData) => {
    const parsed = v2Both.safeParse(
      $customData.history[$customData.history.length - 1].state[$selectedLayer]
    );

    if (parsed.success) {
      console.log("Saving", detail);
      return {
        ...$customData,
        history: [
          ...$customData.history,
          {
            index: $customData.history.length,
            modifiedOn: new Date().toISOString(),
            state: {
              ...$customData.history[$customData.history.length - 1].state,
              [$selectedLayer]: {
                ...parsed.data,
                [detail.half]: {
                  ...parsed.data[detail.half],
                  [detail.stick]: {
                    ...parsed.data[detail.half][detail.stick],
                    [detail.input]: detail.value,
                  },
                },
              },
            },
          },
        ].slice(-20),
      };
    }
    return $customData;
  });
};

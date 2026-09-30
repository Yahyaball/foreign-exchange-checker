export interface Shortcut {
  keys1: string;
  keys2?: string;
  keys3?: string;
  keysTo?: string;
  description: string;
}

export const shortcutGroups: { view: string; shortcuts: Shortcut[] }[] = [
  {
    view: "Global",
    shortcuts: [
      {
        keys1: "Alt",
        keys2: "↓",
        description: "Swap currencies",
      },
      {
        keys1: "Alt",
        keys2: "1",
        keysTo: "4",
        description: "Switch tab",
      },
    ],
  },
  {
    view: "Converter",
    shortcuts: [
      {
        keys1: "Alt",
        keys2: "A",
        description: "Focus amount input",
      },
      {
        keys1: "Alt",
        keys2: "S",
        description: "Open send currency menu",
      },
      {
        keys1: "Alt",
        keys2: "R",
        description: "Open receive currency menu",
      },
      {
        keys1: "Alt",
        keys2: "L",
        description: "Log conversion",
      },
      {
        keys1: "Alt",
        keys2: "F",
        description: "Pin send/receive pair",
      },
    ],
  },
  {
    view: "Currency",
    shortcuts: [
      {
        keys1: "/",
        description: "Focus search",
      },
      {
        keys1: "↑",
        keysTo: "↓",
        description: "Move through list",
      },
      {
        keys1: "Tab",
        description: "Advance through list",
      },
      {
        keys1: "Enter",
        description: "Jump to first result",
      },
      {
        keys1: "Esc",
        description: "Close menu",
      },
    ],
  },
  {
    view: "History",
    shortcuts: [
      {
        keys1: "←",
        keysTo: "→",
        description: "Change range",
      },
    ],
  },
  {
    view: "Tabs",
    shortcuts: [
      {
        keys1: "←",
        keysTo: "→",
        description: "Move between tabs",
      },
      {
        keys1: "Esc",
        description: "Close mobile dropdown",
      },
    ],
  },
  {
    view: "Compare",
    shortcuts: [
      {
        keys1: "↑",
        keysTo: "↓",
        description: "Move between rows",
      },
      {
        keys1: "Enter",
        description: "Select currency",
      },
      {
        keys1: "F",
        description: "Pin row",
      },
    ],
  },
  {
    view: "Favorites",
    shortcuts: [
      {
        keys1: "↑",
        keysTo: "↓",
        description: "Move between rows",
      },
      {
        keys1: "Enter",
        description: "Load pair",
      },
      {
        keys1: "F",
        description: "Unpin row",
      },
    ],
  },
  {
    view: "Log",
    shortcuts: [
      {
        keys1: "↑",
        keysTo: "↓",
        description: "Move between entries",
      },
      {
        keys1: "L",
        description: "Delete focused entry",
      },
      {
        keys1: "Alt",
        keys2: "Shift",
        keys3: "E",
        description: "Export CSV",
      },
      {
        keys1: "Alt",
        keys2: "Shift",
        keys3: "L",
        description: "Clear all",
      },
    ],
  },
  {
    view: "Amount input",
    shortcuts: [
      {
        keys1: "Esc",
        description: "Blur",
      },
    ],
  },
];

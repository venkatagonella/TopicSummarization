// Central registry for the left-hand sections.
// To add a new section later: drop a JSON file in /public/data and add an
// entry here. No other code changes needed.
export const SECTIONS = [
  {
    id: "today",
    label: "Today",
    aggregate: true,
    accent: "#4f46e5",
    description: "Top items across all sources",
    icon: "today",
  },
  {
    id: "slack",
    label: "Slack",
    dataFile: "/data/slack.json",
    accent: "#611f69",
    description: "Mentions, DMs & threads that need a reply",
    icon: "slack",
  },
  {
    id: "jira",
    label: "Jira",
    dataFile: "/data/jira.json",
    accent: "#0052cc",
    description: "Issues assigned to you & due soon",
    icon: "jira",
  },
  {
    id: "gmail",
    label: "Gmail",
    dataFile: "/data/gmail.json",
    accent: "#ea4335",
    description: "Emails awaiting your response",
    icon: "mail",
  },
];

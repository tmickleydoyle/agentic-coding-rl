# Fix: Closing the active tab activates the wrong tab

`components/Tabs.tsx` renders a closable tab bar. Tabs start as `["Home", "Profile",
"Settings"]`. Each tab has a button (`data-testid="tab-<name>"`) and a close button
(`data-testid="close-<name>"`). The currently active tab's button has the class
`active`, and the active tab's content is shown in `data-testid="panel"` as
`Content: <name>`.

Closing a tab removes it. When you close the **active** tab, the tab to its left should
become active; if it was the first tab, the new first tab becomes active. (Closing a
non-active tab must not change which tab is active.)

**Bug:** Closing the active tab leaves `active` pointing at a tab that no longer exists,
so the panel goes blank and no tab shows as `active`. Make the active selection follow
the rule above after a close.

Find and fix the bug. Keep the same `data-testid` attributes. Default export.

import React, { useState } from "react";
import { getAllTags, getContacts } from "../../lib/store";

export function TagsPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const tags = getAllTags();
  const contacts = getContacts();
  const taggedContacts = selectedTag
    ? contacts.filter((c) => c.tags.includes(selectedTag))
    : [];

  return (
    <div data-testid="tags-page">
      <h2>Tags</h2>
      {tags.map((t) => (
        <div
          key={t.tag}
          data-testid="tag-item"
          onClick={() => setSelectedTag(t.tag === selectedTag ? null : t.tag)}
          style={{ cursor: "pointer" }}
        >
          <span data-testid="tag-name">{t.tag}</span>
          <span data-testid="tag-count">{t.count}</span>
        </div>
      ))}
      {selectedTag && (
        <div data-testid="tag-contacts">
          <h3>Contacts tagged: {selectedTag}</h3>
          {taggedContacts.map((c) => (
            <div key={c.id} data-testid="tagged-contact">
              {c.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

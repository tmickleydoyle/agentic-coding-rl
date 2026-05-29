class TrieNode {
  children: Map<string, TrieNode> = new Map<string, TrieNode>();
  isWord = false;
}

export class Trie {
  private root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      let next = node.children.get(ch);
      if (next === undefined) {
        next = new TrieNode();
        node.children.set(ch, next);
      }
      node = next;
    }
    node.isWord = true;
  }

  private find(s: string): TrieNode | null {
    let node = this.root;
    for (let i = 0; i < s.length; i++) {
      const next = node.children.get(s[i]);
      if (next === undefined) return null;
      node = next;
    }
    return node;
  }

  has(word: string): boolean {
    const node = this.find(word);
    return node !== null && node.isWord;
  }

  startsWith(prefix: string): boolean {
    const node = this.find(prefix);
    if (node === null) return false;
    return node.isWord || node.children.size > 0;
  }

  delete(word: string): boolean {
    if (!this.has(word)) return false;

    const remove = (node: TrieNode, depth: number): boolean => {
      // returns true if `node` can be pruned by its parent
      if (depth === word.length) {
        node.isWord = false;
        return node.children.size === 0;
      }
      const ch = word[depth];
      const child = node.children.get(ch);
      if (child === undefined) return false;
      const prune = remove(child, depth + 1);
      if (prune) node.children.delete(ch);
      return node.children.size === 0 && !node.isWord;
    };

    remove(this.root, 0);
    return true;
  }

  wordsWithPrefix(prefix: string): string[] {
    const node = this.find(prefix);
    if (node === null) return [];
    const out: string[] = [];
    const dfs = (n: TrieNode, acc: string): void => {
      if (n.isWord) out.push(acc);
      const chars = Array.from(n.children.keys()).sort();
      for (let i = 0; i < chars.length; i++) {
        dfs(n.children.get(chars[i]) as TrieNode, acc + chars[i]);
      }
    };
    dfs(node, prefix);
    out.sort();
    return out;
  }
}

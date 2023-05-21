export class Trie {
  __type = 'trie';
  children: Record<string, Trie> = {};
  ids: string[] = [];

  public addString(str: string) {
    const words = str.split(/\s/g).map((w) => w.replace(/\W/g, ''));
    this.addWords(words);
  }

  public addWords(strs: string[], id?: string) {
    if (strs.length) {
      const word = strs.shift();
      if (!this.children[word]) {
        this.children[word] = new Trie();
      }
      this.children[word].addWords(strs, id);
    } else {
      if (id && !this.ids.includes(id)) {
        this.ids.push(id);
      }
    }
  }

  public collapseStart() {
    let strMap: Array<{ phrase: string[]; ids: string[]; done?: boolean }> = [];
    for (const child in this.children) {
      const collapsedChild = this.children[child].collapseStart();
      for (const c of collapsedChild) {
        if (!c.done && Object.keys(this.children).length <= 1 && this.ids.length === 0) {
          strMap.push({ phrase: [], ids: [...c.ids], done: false });
        } else if (!c.done && (Object.keys(this.children).length > 1 || this.ids.length > 0)) {
          strMap.push({ phrase: [child], ids: [...c.ids], done: true });
        }
        if (c.done) {
          strMap.push({ done: c.done, ids: c.ids, phrase: [child, ...c.phrase] });
        }
      }
    }

    if (!Object.keys(this.children).length) {
      strMap.push({ phrase: [], ids: [...this.ids] });
    } else if (this.ids.length) {
      strMap.push({ phrase: [], ids: [...this.ids], done: true });
    }

    return strMap;
  }

  public collapse(root: boolean = true) {
    let strMap: Array<{ phrase: string[]; ids: string[]; endIds?: string[] }> = [];

    for (const child in this.children) {
      let collapsedChild: typeof strMap;
      collapsedChild = this.children[child].collapse(false);
      const endIds = collapsedChild.reduce(
        (acc, cc) => [...acc, ...cc.endIds?.filter((e) => !acc.includes(e))],
        [] as string[],
      );
      const ccWithIds = collapsedChild.filter((cc) => cc.ids.length);
      const maxIds = ccWithIds.reduce((acc, cc) => Math.max(acc, cc.ids.length), 0);
      if (endIds.length > 1 && !ccWithIds.length) {
        strMap.push({ ids: [...endIds], phrase: [child], endIds: [...endIds] });
      } else if (ccWithIds.length) {
        for (const c of ccWithIds) {
          strMap.push({ ids: [...c.ids], phrase: [child, ...c.phrase], endIds: [...endIds] });
        }
        if (maxIds < endIds.length) {
          strMap.push({ ids: [...endIds], phrase: [child], endIds: [...endIds] });
        }
      } else if (endIds.length && !root) {
        strMap.push({ ids: [], phrase: [], endIds: [...endIds] });
      }
    }

    if (this.ids.length) {
      strMap.push({ phrase: [], ids: [], endIds: [...this.ids] });
    }
    return strMap;
  }

  constructor(str?: string) {
    if (str) {
      this.addString(str);
    }
  }
}

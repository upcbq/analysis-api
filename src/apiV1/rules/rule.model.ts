interface IRegexRule {
  type: 'regex';
  scope: 'word' | 'phrase';
  matchers: Array<{
    tags: string[];
    regex: string[];
  }>;
}

interface IUniqueRule {
  type: 'unique';
  scope: 'word' | 'phrase' | 'beginning' | 'end';
  tags: string[];
}

interface IMatchRule {
  type: 'match';
  scope: 'word' | 'phrase' | 'beginning' | 'end';
  maxCount: number;
  maxLength?: number;
}

export type IRule = IMatchRule | IUniqueRule | IRegexRule;

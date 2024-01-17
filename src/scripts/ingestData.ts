import '@/config/db';
import VerseList from '@/models/verseList.model';
import Verse from '@/models/verse.model';
import { Trie } from './trie';
import isEqual from 'lodash/isEqual';
import { IWordReference } from '@/apiV1/manualTags/manualTag.model';
import { stringToWordReference, wordReferenceToString } from '@/utils/utilityFunctions';
import { IAutoTag, getAutoTagCollectionName, getAutoTagModel } from '@/apiV1/autoTags/autoTag.model';
import { IStat, getStatCollectionName, getStatModel } from '@/apiV1/stats/stat.model';

const ingestTags = true;
const ingestStats = true;

function isSub<T>(arr1: T[], arr2: T[]) {
  let i = 0,
    j = 0;
  const m = arr2.length,
    n = arr1.length;
  while (i < n && j < m) {
    if (arr1[i] === arr2[j]) {
      i++;
      j++;
      if (j === m) return true;
    } else {
      i = i - j + 1;
      j = 0;
    }
  }
  return false;
}

(async () => {
  try {
    let year = 2023;
    year = +process.argv[2];
    const verseLists = await VerseList.find({
      organization: 'upci',
      year: year,
    });

    for (const verseList of verseLists) {
      const verses = (
        await Verse.find({
          $or: verseList.verses.map((v) => ({ translation: 'kjv', chapter: v.chapter, book: v.book, verse: v.verse })),
        }).exec()
      ).map((v) => {
        return {
          ...v.toJSON(),
          words: v.text.split(/\s/g).map((w) => w.replace(/[^a-zA-Z']/g, '').toLowerCase()),
        };
      });

      const sortedVerses = verseList.verses
        .map((vlv) => {
          const v = verses.find((v) => v.book === vlv.book && v.chapter === vlv.chapter && v.verse === vlv.verse);
          if (v) {
            return {
              book: v.book,
              chapter: v.chapter,
              verse: v.verse,
              text: v.text,
              words: v.words.filter((w) => w.length),
              sortOrder: vlv.sortOrder,
            };
          }
        })
        .filter((v) => !!v)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      const wordFreq: Record<string, Array<IWordReference>> = {};

      const startTrie = new Trie();
      const endTrie = new Trie();
      const phraseTrie = new Trie();
      for (const verse of sortedVerses) {
        startTrie.addWords([...verse.words], wordReferenceToString(verse));
        endTrie.addWords([...verse.words].reverse(), wordReferenceToString(verse, verse.words.length));
        const phraseWords: string[][] = [];
        for (let i = 0; i < verse.words.length; i++) {
          const word = verse.words[i];
          phraseWords.push(verse.words.slice(i));
          if (!wordFreq[word]) {
            wordFreq[word] = [{ ...verse, word: i }];
          } else {
            wordFreq[word].push({ ...verse, word: i });
          }
        }
        phraseWords.forEach((p, i) => {
          phraseTrie.addWords(p, wordReferenceToString(verse, i));
        });
      }

      const collapsedStart = startTrie
        .collapseStart()
        .sort((a, b) => a.phrase.length - b.phrase.length)
        .map((c) => ({ phrase: c.phrase, ids: c.ids }));
      const collapsedEnd = endTrie
        .collapseStart()
        .sort((a, b) => a.phrase.length - b.phrase.length)
        .map((c) => ({ phrase: c.phrase.reverse(), ids: c.ids }));
      const collapsedPhrase = phraseTrie.collapse();
      const filteredPhrase = collapsedPhrase
        .filter((c, i) => {
          const phrase = collapsedPhrase.find(
            (cp, j) =>
              i !== j &&
              isSub(cp.phrase, c.phrase) &&
              isEqual(
                cp.ids,
                c.ids,
              ),
          );
          return !phrase;
        })
        .filter((p) => p.phrase.length > 2 || (p.ids.length < 2 && p.phrase.length > 1))
        .map((p) => {
          const { endIds, ...newP } = p;
          return { ...newP };
        })
        .sort((a, b) => a.phrase.join(' ').localeCompare(b.phrase.join(' ')));

      const mappedWordFreq = Object.keys(wordFreq)
        .map((k) => {
          return {
            word: k,
            ids: wordFreq[k],
            verses: wordFreq[k].reduce((dedup, w) => {
              if (!dedup.some((dw) => w.book === dw.book && w.chapter === dw.chapter && w.verse === dw.verse)) {
                dedup.push(w);
              }
              return dedup;
            }, [] as IWordReference[]),
          };
        })
        .filter((w) => w.ids.length <= 10);

      function verseIndexFromWordReference(wordRef: IWordReference) {
        return verseList.verses.findIndex(
          (v) => v.book === wordRef?.book && v.chapter === wordRef?.chapter && v.verse === wordRef?.verse,
        );
      }

      if (ingestTags) {
        const AutoTag = getAutoTagModel(verseList, true);
        const oneTimeWords = mappedWordFreq.filter((w) =>
          ['experienced', 'intermediate'].includes(verseList.division) && verseList.year >= 2023
            ? w.verses.length === 1
            : w.ids.length === 1,
        );
        const twoTimeWords = mappedWordFreq.filter((w) =>
          ['experienced', 'intermediate'].includes(verseList.division) && verseList.year >= 2023
            ? w.verses.length === 2
            : w.ids.length === 2,
        );
        const threeTimeWords = mappedWordFreq.filter((w) =>
          ['experienced', 'intermediate'].includes(verseList.division) && verseList.year >= 2023
            ? w.verses.length === 3
            : w.ids.length === 3,
        );
        const tags: IAutoTag[] = [];

        for (const oneTimeWord of oneTimeWords) {
          tags.push(
            new AutoTag({
              tag: 'OneTime',
              verseIndex: verseIndexFromWordReference(oneTimeWord.ids[0]),
              wordIndex: oneTimeWord.ids[0].word,
              length: 1,
            }),
          );
        }

        for (const twoTimeWord of twoTimeWords) {
          for (const wordRef of twoTimeWord.ids) {
            tags.push(
              new AutoTag({
                tag: 'TwoTime',
                verseIndex: verseIndexFromWordReference(wordRef),
                wordIndex: wordRef.word,
                length: 1,
                related: twoTimeWord.ids.filter((wr) => wr !== wordRef),
              }),
            );
          }
        }

        for (const threeTimeWord of threeTimeWords) {
          for (const wordRef of threeTimeWord.ids) {
            tags.push(
              new AutoTag({
                tag: 'ThreeTime',
                verseIndex: verseIndexFromWordReference(wordRef),
                wordIndex: wordRef.word,
                length: 1,
                related: threeTimeWord.ids.filter((wr) => wr !== wordRef),
              }),
            );
          }
        }

        for (const uniqueBeginning of collapsedStart) {
          const verseRef = uniqueBeginning.ids[0];
          const wordRef = `${verseRef}.0`;
          tags.push(
            new AutoTag({
              tag: 'UniqueStart',
              verseIndex: verseIndexFromWordReference(stringToWordReference(wordRef)),
              wordIndex: 0,
              length: uniqueBeginning.phrase.length,
            }),
          );
        }

        for (const uniqueEnd of collapsedEnd) {
          const lastWordRef = stringToWordReference(uniqueEnd.ids[0]);
          const wordRef = wordReferenceToString({ ...lastWordRef, word: lastWordRef.word - uniqueEnd.phrase.length });
          tags.push(
            new AutoTag({
              tag: 'UniqueEnd',
              verseIndex: verseIndexFromWordReference(stringToWordReference(wordRef)),
              wordIndex: lastWordRef.word - uniqueEnd.phrase.length,
              length: uniqueEnd.phrase.length,
            }),
          );
        }

        const hasCollection = await AutoTag.db.db
          .listCollections({ name: getAutoTagCollectionName(verseList._id) })
          .toArray();
        if (hasCollection.length) {
          console.log(`dropped autotags for ${verseList.year} ${verseList.division}`);
          await AutoTag.collection.drop();
        }
        await AutoTag.insertMany(tags);
      }

      if (ingestStats) {
        const Stat = getStatModel(verseList, true);
        const stats: IStat[] = [];

        const sortedWords = Object.keys(wordFreq).sort();

        for (let i = 0; i < sortedWords.length; i++) {
          const word = sortedWords[i];
          stats.push(new Stat({
            references: wordFreq[word],
            type: 'word',
            text: word,
            count: wordFreq[word].length,
            sortOrder: i,
          }));
        }

        for (let i = 0; i < filteredPhrase.length; i++) {
          const phrase = filteredPhrase[i];
          stats.push(new Stat({
            references: phrase.ids.map((id) => stringToWordReference(id)),
            type: 'phrase',
            length: phrase.phrase.length,
            text: phrase.phrase.join(' '),
            count: phrase.ids.length,
            sortOrder: i,
          }))
        }

        const hasCollection = await Stat.db.db
          .listCollections({ name: getStatCollectionName(verseList._id) })
          .toArray();
        if (hasCollection.length) {
          console.log(`dropped stats for ${verseList.year} ${verseList.division}`);
          await Stat.collection.drop();
        }

        await Stat.insertMany(stats);
      }
    }
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  process.exit(0);
})();

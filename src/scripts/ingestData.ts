import '@/config/db';
import VerseList from '@/models/verseList.model';
import Verse from '@/models/verse.model';
import { Trie } from './trie';
import { referenceToString } from '@shared/utilities/utilityFunctions';
import { IReference } from '@shared/types/reference';
import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';
import nlp from 'compromise/three';

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
    const verseList = await VerseList.findOne({
      year: 2023,
      division: 'experienced',
      organization: 'upci',
    }).exec();

    const verses = (
      await Verse.find({
        $or: verseList.verses.map((v) => ({ translation: 'kjv', chapter: v.chapter, book: v.book, verse: v.verse })),
      }).exec()
    ).map((v) => {
      return {
        ...v.toJSON(),
        words: v.text.split(/\s/g).map((w) => w.replace(/\W/g, '').toLowerCase()),
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

    // const wordFreq: Record<string, Array<IReference & { index: number }>> = {};

    // const startTrie = new Trie();
    // const endTrie = new Trie();
    // const phraseTrie = new Trie();
    // for (const verse of sortedVerses) {
    //   startTrie.addWords([...verse.words], `${verse.book}_${verse.chapter}:${verse.verse}`);
    //   endTrie.addWords([...verse.words].reverse(), `${verse.book}_${verse.chapter}:${verse.verse}`);
    //   const phraseWords: string[][] = [];
    //   for (let i = 0; i < verse.words.length; i++) {
    //     const word = verse.words[i];
    //     phraseWords.push(verse.words.slice(i));
    //     if (!wordFreq[word]) {
    //       wordFreq[word] = [{ ...verse, index: i }];
    //     } else {
    //       wordFreq[word].push({ ...verse, index: i });
    //     }
    //   }
    //   phraseWords
    //     // .map((p) => p.reverse())
    //     .forEach((p, i) => {
    //       phraseTrie.addWords(p, `${verse.book}_${verse.chapter}:${verse.verse}.${i}`);
    //     });
    // }

    // const collapsedStart = startTrie
    //   .collapseStart()
    //   .sort((a, b) => a.phrase.length - b.phrase.length)
    //   .map((c) => ({ phrase: c.phrase.join(' '), ids: c.ids }));
    // const collapsedEnd = endTrie
    //   .collapseStart()
    //   .sort((a, b) => a.phrase.length - b.phrase.length)
    //   .map((c) => ({ phrase: c.phrase.reverse().join(' '), ids: c.ids }));
    // const collapsedPhrase = phraseTrie.collapse();
    // const filteredPhrase = collapsedPhrase
    //   .filter((c, i) => {
    //     const phrase = collapsedPhrase.find(
    //       (cp, j) =>
    //         i !== j &&
    //         isSub(cp.phrase, c.phrase) &&
    //         isEqual(
    //           cp.ids.map((id) => id.split('.')[0]),
    //           c.ids.map((id) => id.split('.')[0]),
    //         ),
    //     );
    //     return !phrase;
    //   })
    //   .filter((p) => p.ids.length > 1 && p.ids.length <= 10)
    //   .sort((a, b) => a.phrase.length - b.phrase.length);

    // const mappedWordFreq = Object.keys(wordFreq)
    //   .map((k) => {
    //     return {
    //       word: k,
    //       ids: wordFreq[k].map(referenceToString),
    //     };
    //   })
    //   .filter((w) => w.ids.length <= 10);
    // const mappedWordPhrase = mappedWordFreq
    //   .filter((w) => w.ids.length > 1)
    //   .map((w) => {
    //     const phrases = filteredPhrase.filter((p) => p.phrase.includes(w.word));
    //     const maxPhraseCount = phrases.reduce((tot, p) => Math.max(tot, p.ids.length), 0);
    //     return {
    //       word: w,
    //       maxPhraseCount,
    //       equal: w.ids.length === maxPhraseCount,
    //     };
    //   });

    const chapterText = sortedVerses.reduce((acc, v) => {
      const chapter = `${v.book}_${v.chapter}`;
      if (!acc[chapter]) {
        acc[chapter] = '';
      }
      acc[chapter] += `${acc[chapter].length > 0 ? ' ' : ''}⠀${v.text}`;

      return acc;
    }, {} as Record<string, string>);
    const mappedChapterText = Object.keys(chapterText).map((k) => ({ chapter: k, text: chapterText[k] }));

    nlp.plugin({
      tags: {
        Divine: {
          is: 'Noun',
        },
        DivinePerson: {
          is: 'Divine Person',
        },
        FamilyRelationship: {
          is: 'Noun',
        },
        Evil: {
          is: 'Noun',
        },
        People: {
          is: 'Plural',
          not: 'Person',
        },
        PersonGroup: {
          is: 'People',
        },
        Nationality: {
          is: 'PersonGroup',
        },
        CultureGroup: {
          is: 'PersonGroup',
        },
      },
      words: {
        gentiles: 'CultureGroup',
        jannes: 'MaleName',
        jambres: 'MaleName',
        crescens: 'MaleName',
        titus: 'MaleName',
        demas: 'MaleName',
        aquila: 'MaleName',
        onesimus: 'MaleName',
        tychicus: 'MaleName',
        artemas: 'MaleName',
        philetus: 'MaleName',
        eubulus: 'MaleName',
        zenas: 'MaleName',
        phygellus: 'MaleName',
        hermogenes: 'MaleName',
        hymenaeus: 'MaleName',
        apollos: 'MaleName',
        archippus: 'MaleName',
        barnabas: 'MaleName',
        nymphas: 'MaleName',
        justus: 'MaleName',
        pudens: 'MaleName',
        linus: 'MaleName',
        erastus: 'MaleName',
        trophimus: 'MaleName',
        onesiphorus: 'MaleName',
        timotheus: 'MaleName',
        philemon: 'MaleName',
        aristarchus: 'MaleName',
        carpus: 'MaleName',
        epaphras: 'MaleName',
        claudia: 'FemaleName',
        prisca: 'FemaleName',
        apphia: 'FemaleName',
        eve: 'FemaleName',
        miletum: 'City',
        nicopolis: 'City',
        corinth: 'City',
        troas: 'City',
        ephesus: 'City',
        thessalonica: 'City',
        antioch: 'City',
        colosse: 'City',
        iconium: 'City',
        lystra: 'City',
        hierapolis: 'City',
        laodicea: 'City',
        dalmatia: 'Region',
        galatia: 'Region',
        crete: 'Region',
        greek: 'Nationality',
        jew: 'Nationality',
        jewish: 'Nationality',
        cretians: 'CultureGroup',
        gentile: 'CultureGroup',
        barbarian: 'CultureGroup',
        laodiceans: 'CultureGroup',
        scythian: 'Nationality',
        satan: 'Evil',
      },
      irregulars: {
        say: {
          presentTense: 'saith',
        },
      },
      compute: {
        postProcess: (doc: ReturnType<typeof nlp>) => {
          doc.compute('root');
          doc.match('(god|jesus|father|christ|lord|spirit|godhead)').match('#ProperNoun').tag('#Divine');
          doc.match('holy (spirit|ghost)').tag('#Divine');
          doc.match('(king|lord) of (kings|lords)').tag('#Divine');
          doc.match('#ProperNoun').match('(savior|saviour)').tag('#Divine');
          doc.match('((jesus|christ) (jesus|christ)|jesus|christ)').tag('#MaleName');
          doc.match('jesus which is called .').match('#Divine').unTag('#Divine').tag('MaleName');
          doc.match('son of #Divine').tag('Divine');
          doc.match('your Master').match('#ProperNoun').tag('Divine');
          doc.match('pontius pilate').tag('MaleName');
          doc
            .match('#ProperNoun')
            .filter((v) => (v.pre() as unknown as string).includes('⠀'))
            .not('(#Person|#Divine|#Place|#People|#Evil)')
            .unTag('#ProperNoun')
            .forEach((v) => {
              v.pre((v.pre() as any).replace(/⠀/g, ''));
            });
          doc
            .match('{say} #ProperNoun')
            .match('#ProperNoun')
            .not('(#Person|#Divine|#Place|#People|#Evil)')
            .unTag('#ProperNoun');
          doc
            .match('{say} to @hasComma #ProperNoun')
            .match('#ProperNoun')
            .not('(#Person|#Divine|#Place|#People|#Evil)')
            .unTag('#ProperNoun');
          // doc
          //   .match('(@hasColon|@hasComma) #ProperNoun')
          //   .match('#ProperNoun')
          //   .not('(#Person|#Divine|#Place|#People)')
          //   .unTag('#ProperNoun');
        },
      },
      hooks: ['postProcess'],
    } as any);

    const analyzedChapterText = mappedChapterText.map((t) => {
      const analyzed = nlp(t.text);

      return {
        chapter: t.chapter,
        // text: t.text,
        // .replace(/⠀/g, ''),
        // analyzed: analyzed.json(),
        properNouns: (analyzed.json() as any[])
          .map((v) =>
            v.terms.map((t) => ({
              text: t.text,
              tags: t.tags,
            })),
          )
          .flat(),
      };
    });

    console.log(JSON.stringify(analyzedChapterText, null, 2));

    // console.log(JSON.stringify(phraseTrie, null, 2));

    // console.log(
    //   JSON.stringify(
    //     {
    //       mappedWordPhrase,
    //       wordFreq: mappedWordFreq,
    //       start: collapsedStart,
    //       startLength: collapsedStart.length,
    //       end: collapsedEnd,
    //       endLength: collapsedEnd.length,
    //       phrase: filteredPhrase.map((c) => ({ phrase: c.phrase.join(' '), ids: c.ids })),
    //       phraseLength: filteredPhrase.length,
    //     },
    //     null,
    //     2,
    //   ),
    // );
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  process.exit(0);
})();

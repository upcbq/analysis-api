import TagInfo, { ITagInfoJson } from '@/apiV1/tagInfo/tagInfo.model';
import '@/config/db';

(async () => {
  try {
    await TagInfo.collection.drop();
    const DATA: Record<string, ITagInfoJson> = {
      OneTime: {
        name: 'One Time Word',
        description: 'Words that are only contained in verses of study a single time.',
        tag: 'OneTime',
        style: {
          color: 'blue',
        },
      },
      TwoTime: {
        name: 'Two Time Word',
        description: 'Words that are only contained in verses of study two times.',
        tag: 'TwoTime',
        style: {
          color: 'green',
        },
      },
      UniqueStart: {
        name: 'Unique Start',
        description: 'The words at the start of the verse that make it unique. Useful for quotation completions.',
        tag: 'UniqueStart',
        style: {
          textDecoration: 'underline',
          fontWeight: 'bold',
        },
      },
      UniqueEnd: {
        name: 'Unique End',
        description: 'The words at the end of the verse that make it unique.',
        tag: 'UniqueEnd',
        style: {
          textDecoration: 'underline',
          fontWeight: 'bold',
        },
      },
    };

    for (const tag in DATA) {
      const tagInfo = new TagInfo(DATA[tag]);
      await tagInfo.save();
    }
  } catch (e) {
    console.log('error', e);
  }
  process.exit(0);
})();

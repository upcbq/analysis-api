import { ParamsDictionary } from 'express-serve-static-core';
import Joi from 'joi';

export interface IGetPhraseStatsRequest extends ParamsDictionary {
  verseListId: string;
}

export const GetPhraseStatsParams = Joi.object<IGetPhraseStatsRequest>({
  verseListId: Joi.string(),
});

export interface IGetPhraseStatsQuery extends qs.ParsedQs {
  start?: string;
  end?: string;
}

export const GetPhraseStatsQuery = Joi.object<IGetPhraseStatsQuery>({
  start: Joi.number().optional(),
  end: Joi.number().optional(),
});

export interface IGetPhrasesStatsQuery extends qs.ParsedQs {
  max?: string;
  min?: string;
}

export const GetPhrasesStatsQuery = Joi.object<IGetPhrasesStatsQuery>({
  max: Joi.string().regex(/^\d+$/).optional(),
  min: Joi.string().regex(/^\d+$/).optional(),
});

export interface IGetSinglePhraseStatRequest extends IGetPhraseStatsRequest {
  phrase: string;
}

export const GetSinglePhraseStatsParams = GetPhraseStatsParams.keys({
  phrase: Joi.string(),
});
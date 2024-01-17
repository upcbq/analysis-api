import { ParamsDictionary } from 'express-serve-static-core';
import Joi from 'joi';

export interface IGetWordStatsRequest extends ParamsDictionary {
  verseListId: string;
}

export const GetWordStatsParams = Joi.object<IGetWordStatsRequest>({
  verseListId: Joi.string(),
});

export interface IGetWordStatsQuery extends qs.ParsedQs {
  start?: string;
  end?: string;
}

export const GetWordStatsQuery = Joi.object<IGetWordStatsQuery>({
  start: Joi.number().optional(),
  end: Joi.number().optional(),
});

export interface IGetWordsStatsQuery extends qs.ParsedQs {
  max?: string;
  min?: string;
}

export const GetWordsStatsQuery = Joi.object<IGetWordsStatsQuery>({
  max: Joi.string().regex(/^\d+$/).optional(),
  min: Joi.string().regex(/^\d+$/).optional(),
});

export interface IGetSingleWordStatRequest extends IGetWordStatsRequest {
  word: string;
}

export const GetSingleWordStatsParams = GetWordStatsParams.keys({
  word: Joi.string(),
});
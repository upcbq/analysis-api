import { ParamsDictionary } from 'express-serve-static-core';
import Joi from 'joi';

export interface IGetVerseListByIdParams extends ParamsDictionary {
  verseListId: string;
}

export const GetVerseListByIdParams = Joi.object<IGetVerseListByIdParams>({
  verseListId: Joi.string(),
});

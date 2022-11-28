import { ParamsDictionary } from 'express-serve-static-core';
import Joi from 'joi';

export interface ISpecifyVerseListParams extends ParamsDictionary {
  organization: string;
  year: string;
  division: string;
}

export const SpecifyVerseListParams = Joi.object<ISpecifyVerseListParams>({
  organization: Joi.string().empty('').required(),
  year: Joi.string().empty('').required(),
  division: Joi.string().empty('').required(),
});

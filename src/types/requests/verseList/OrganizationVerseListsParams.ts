import { ParamsDictionary } from 'express-serve-static-core';
import Joi from 'joi';

export interface IOrganizationVerseListsParams extends ParamsDictionary {
  organization: string;
}

export const OrganizationVerseListsParams = Joi.object<IOrganizationVerseListsParams>({
  organization: Joi.string(),
});

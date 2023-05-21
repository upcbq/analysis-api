import { GetVersesTagsParams, IGetVersesTagsParams } from "./getVersesTagsRequest";
import Joi from 'joi';

export interface IGetVerseTagsParams extends IGetVersesTagsParams {
  verseIndex: string;
}

export const GetVerseTagsParams = GetVersesTagsParams.keys({
  verseIndex: Joi.string(),
});

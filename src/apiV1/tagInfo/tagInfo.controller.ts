import { internalServerError } from '@shared/helpers/errorHandler';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import TagInfo from './tagInfo.model';
import kebabCase from 'lodash/kebabCase';

/**
 * Turns a json object into css styles
 */
function jsonToStyle(obj: Record<string, string>) {
  return Object.entries(obj).reduce((css, e) => {
    css += `${kebabCase(e[0])}:${e[1]};`;
    return css;
  }, '');
}

export class TagInfoController {
  /**
   * Gets all tagInfo objects
   */
  public static async getAllTagInfo(req: Request, res: Response) {
    try {
      const allTagInfo = await TagInfo.find().exec();
      res.status(httpStatus.OK).json(allTagInfo);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }

  /**
   * Generates a css file containing the defined classes for all tagInfo objects
   */
  public static async getTagCss(req: Request, res: Response) {
    try {
      const allTagInfo = await TagInfo.find().exec();
      const css = allTagInfo.reduce((css, tag) => {
        css += `.${tag.tag} { ${jsonToStyle(tag.toJSON().style)} }\n`;
        return css;
      }, '');
      res
        .status(httpStatus.OK)
        .contentType('.css')
        .header({
          'Cross-Origin-Resource-Policy': 'cross-origin',
        })
        .send(css);
    } catch (err) {
      internalServerError(err, req, res);
    }
  }
}

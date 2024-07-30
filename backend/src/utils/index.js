"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

const convertToObjectIDMongodb = (id) => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

// [a, b] => { a: 1, b: 1} => => select field in mongo
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

// [a, b] => { a: 0, b: 0} => un select field  in mongo
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  const removeUndefinedObj = removeUndefinedObject(obj);
  Object.keys(removeUndefinedObj).forEach((k) => {
    if (
      typeof removeUndefinedObj[k] === "object" &&
      !Array.isArray(removeUndefinedObj[k])
    ) {
      const nestedObj = updateNestedObjectParser(removeUndefinedObj[k]);
      Object.keys(removeUndefinedObject(nestedObj)).forEach((nestKey) => {
        final[`${k}.${nestKey}`] = nestedObj[nestKey];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIDMongodb,
};

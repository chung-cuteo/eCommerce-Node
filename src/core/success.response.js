"use strict";
const { StatusCodes, ReasonPhrases } = require("./http.status.code");

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {},
  }) {
    this.message = message || reasonStatusCode;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class Ok extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class Created extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata,
    options={},
  }) {
    super({ message, statusCode, reasonStatusCode, metadata});
    this.options = options
  }
}

module.exports = {
  Ok,
  Created,
};

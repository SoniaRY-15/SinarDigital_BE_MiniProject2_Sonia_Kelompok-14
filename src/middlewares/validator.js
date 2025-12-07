/**
 * Validator middleware for Pet create/update
 * - create: requires name, type, reason, ownerId and age (years/months)
 * - update: allows partial updates, but validates provided fields
 *
 * Accepts either:
 *  - ageYears and ageMonths fields (commonly from form-data)
 *  - OR an `age` object (e.g. JSON body { age: { years: X, months: Y } })
 */

const parseAgeFromBody = (body) => {
  // Normalize/resolve ageYears and ageMonths from various possible inputs
  let years = undefined;
  let months = undefined;

  if (body.age && typeof body.age === "object") {
    // body.age could be an object { years, months }
    years = Number(body.age.years ?? body.ageYears ?? 0);
    months = Number(body.age.months ?? body.ageMonths ?? 0);
  } else if (typeof body.age === "string") {
    // Maybe a JSON string: try parse
    try {
      const parsed = JSON.parse(body.age);
      years = Number(parsed.years ?? body.ageYears ?? 0);
      months = Number(parsed.months ?? body.ageMonths ?? 0);
    } catch {
      // fallback to fields
      years = Number(body.ageYears ?? 0);
      months = Number(body.ageMonths ?? 0);
    }
  } else {
    // Prefer explicit ageYears/ageMonths fields
    years = Number(body.ageYears ?? 0);
    months = Number(body.ageMonths ?? 0);
  }

  // If NaN fallback to 0
  if (Number.isNaN(years)) years = 0;
  if (Number.isNaN(months)) months = 0;

  return { years, months };
};

const create = (req, res, next) => {
  try {
    const { name, type, reason, ownerId } = req.body;
    if (
      !name ||
      !type ||
      !reason ||
      typeof ownerId === "undefined" ||
      ownerId === null ||
      ownerId === ""
    ) {
      return res
        .status(400)
        .json({
          message: "Fields name, type, reason, and ownerId are required.",
        });
    }

    // parse/normalize age
    const { years, months } = parseAgeFromBody(req.body);

    if (years < 0 || months < 0 || months > 11) {
      return res
        .status(400)
        .json({
          message:
            "Invalid age: years must be >= 0 and months must be between 0 and 11.",
        });
    }

    // normalize fields on req.body for downstream usage
    req.body.ageYears = Number(years);
    req.body.ageMonths = Number(months);
    req.body.ownerId = Number(ownerId);

    next();
  } catch (err) {
    next(err);
  }
};

const update = (req, res, next) => {
  try {
    // If no body, just continue
    if (!req.body || Object.keys(req.body).length === 0) {
      return next();
    }

    // If age info provided in any form, validate it
    const hasAgeFields =
      "age" in req.body || "ageYears" in req.body || "ageMonths" in req.body;

    if (hasAgeFields) {
      const { years, months } = parseAgeFromBody(req.body);
      if (years < 0 || months < 0 || months > 11) {
        return res
          .status(400)
          .json({
            message:
              "Invalid age: years must be >= 0 and months must be between 0 and 11.",
          });
      }
      req.body.ageYears = Number(years);
      req.body.ageMonths = Number(months);
    }

    // If ownerId provided, normalize to number
    if (typeof req.body.ownerId !== "undefined" && req.body.ownerId !== "") {
      const ownerIdNum = Number(req.body.ownerId);
      if (Number.isNaN(ownerIdNum)) {
        return res.status(400).json({ message: "ownerId must be a number." });
      }
      req.body.ownerId = ownerIdNum;
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { create, update };

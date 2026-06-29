export function asyncHandler(fn) {
  return function (req, res, next) { // detect function wrap around fn(function in controller)
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

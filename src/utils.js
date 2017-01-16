// @flow

// Recursively remove undefined, null, empty objects and empty arrays
export const compact = (obj: any): any => {
  if (obj === null) {
    return undefined;
  }

  if (Array.isArray(obj)) {
    const compacted = obj.map(v => compact(v)).filter(
      v => typeof v !== 'undefined'
    );

    return compacted.length === 0 ? undefined : compacted;
  }

  if (typeof obj === 'object') {
    const compacted = Object.keys(obj).reduce((acc, key) => {
      const nested = compact(obj[key]);

      if (typeof nested === 'undefined') {
        return acc;
      } else {
        return {
          ...acc,
          [key]: nested
        };
      }
    }, {});

    return Object.keys(compacted).length === 0 ? undefined : compacted;
  }

  return obj;
};

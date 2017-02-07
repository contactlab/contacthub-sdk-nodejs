// @flow

// Recursively remove undefined, null, empty objects and empty arrays
export const compact = (value: any): any => {
  if (value === null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    const compacted = value.map(v => compact(v)).filter(
      v => typeof v !== 'undefined'
    );

    return compacted.length === 0 ? undefined : compacted;
  }

  if (typeof value === 'object' && value instanceof Date === false) {
    const compacted = Object.keys(value).reduce((acc, key) => {
      const nested = compact(value[key]);

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

  return value;
};

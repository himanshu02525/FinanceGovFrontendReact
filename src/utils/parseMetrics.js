export function parseMetrics(metricsPayload) {
  if (!metricsPayload) return {};

  try {
    // Some APIs may double-encode; attempt parse until it's an object
    let parsedMetrics = metricsPayload;
    if (typeof parsedMetrics !== 'string') return parsedMetrics;
    parsedMetrics = JSON.parse(parsedMetrics);

    // if nested string values inside, try parsing them as JSON too
    Object.keys(parsedMetrics).forEach((keyName) => {
      if (typeof parsedMetrics[keyName] === 'string') {
        try {
          parsedMetrics[keyName] = JSON.parse(parsedMetrics[keyName]);
        } catch (ignore) {
          // leave value as-is if it isn't JSON
        }
      }
    });

    return parsedMetrics;
  } catch (firstParseError) {
    try {
      return JSON.parse(metricsPayload);
    } catch (secondParseError) {
      console.warn('Failed to parse metrics', firstParseError);
      return {};
    }
  }
}

export default parseMetrics;

const RECALL_PATTERN = /recall:([A-Za-z0-9]+)/;
const RECALL_PATTERN_GLOBAL = /recall:([A-Za-z0-9]+)/g;
const FALLBACK_PATTERN = /fallback:(\S*)/;
const RECALL_INFO_PATTERN = /recall:([A-Za-z0-9]+)\/fallback:(\S*)/;

export function extractId(text: string) {
  const match = text.match(RECALL_PATTERN);
  ...
}

export function extractIds(text: string) {
  const matches = text.match(RECALL_PATTERN_GLOBAL);
  ...
  const idMatch = match.match(RECALL_PATTERN);
  ...
}

export function extractFallbackValue(text: string): string {
  const match = text.match(FALLBACK_PATTERN);
  ...
}

export function extractRecallInfo(headline: string): string | null {
  const match = headline.match(RECALL_INFO_PATTERN);
  ...
}

export function findRecallInfoById(text: string, id: string): string | null {
  const pattern = new RegExp(`recall:${id}\/fallback:(\S*)`, "g");
  ...
}
    return match[1];
  } else {
    return "";
  }
}

export function extractRecallInfo(headline: string): string | null {
  const pattern = /recall:([A-Za-z0-9]+)\/fallback:(\S*)/;
  const match = headline.match(pattern);
  return match ? match[0] : null;
}

export const checkForRecall = (headline: string, survey: TSurvey) => {
  let newHeadline = headline;
  if (!headline.includes("recall:")) return headline;
  while (newHeadline.includes("recall:")) {
    const recallInfo = extractRecallInfo(newHeadline);
    if (recallInfo) {
      const questionId = extractId(recallInfo);
      newHeadline = newHeadline.replace(
        recallInfo,
        `@${survey.questions.find((question) => question.id === questionId)?.headline}`
      );
    }
  }
  return newHeadline;
};

export function findRecallInfoById(text: string, id: string): string | null {
  const pattern = new RegExp(`recall:${id}\\/fallback:(\\S*)`, "g");
  const match = text.match(pattern);
  return match ? match[0] : null;
}

export const formatText = (headline: string, survey: TSurvey) => {
  let newHeadline = headline;
  if (!headline.includes("recall:")) return headline;

  while (newHeadline.includes("recall:")) {
    const recallInfo = extractRecallInfo(newHeadline);
    if (recallInfo) {
      const questionId = extractId(recallInfo);
      let questionHeadline = survey.questions.find((question) => question.id === questionId)?.headline;
      while (questionHeadline?.includes("recall:")) {
        const recallInfo = extractRecallInfo(questionHeadline);
        if (recallInfo) {
          questionHeadline = questionHeadline.replaceAll(recallInfo, "___");
        }
      }
      newHeadline = newHeadline.replace(recallInfo, `/${questionHeadline}\\`);
    }
  }
  return newHeadline;
};

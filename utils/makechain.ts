export const makeChain = async (
  question: string,
  history: [string, string][],
) => {
  const responseText = `Did you really just write: ${question} to me right now? Oh you scoundrel!`;
  return {
      text: responseText
  };
};

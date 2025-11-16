import { type Questions } from "~/types/questions";
export const filterProcutsByAnswers = (
  products: any[],
  answers: { [id: number]: string },
  questions: Questions,
  answerToTagsMapping: any
) => {
  const tags = new Set<string>();

  const questionToAnswer: { [questionText: string]: string } = {};

  questions.questions.forEach((question) => {
    const answer = answers[question.id];
    if (!answer) return;

    questionToAnswer[question.text] = answer;
  });

  Object.keys(questionToAnswer).forEach((questionText) => {
    const answerText = questionToAnswer[questionText];

    const mapping = answerToTagsMapping[questionText];
    if (mapping && mapping[answerText]) {
      mapping[answerText].forEach((tag: string) => tags.add(tag));
    }
  });

  const tagsArray = Array.from(tags);

  return products.filter((product) =>
    tagsArray.some((tag) => product.tags?.includes(tag))
  );
};

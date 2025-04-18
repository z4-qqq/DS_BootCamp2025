import { baseApi } from './base.ts';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface HintRequest {
  persona: string;
  skill: string;
  messages: ChatMessage[];
}

export const assistantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHint: builder.mutation<{ hint: string }, HintRequest>({
      query: (body) => ({
        url: '/hint',
        method: 'POST',
        body,
      }),
    }),
    evaluate: builder.mutation<any, void>({
      query: () => ({
        url: '/evaluation',
        method: 'POST',
      }),
    }),
    feedbackEvaluation: builder.mutation<any, void>({
      query: () => ({
        url: '/feedback_evaluation',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetHintMutation,
  useEvaluateMutation,
  useFeedbackEvaluationMutation
} = assistantApi;

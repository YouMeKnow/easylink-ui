import NarrowPage from "@/components/common/NarrowPage";
import StartAuth from "@/features/auth/StartAuth";

export default function SignInPage({ questions, setQuestions }) {
  return (
    <NarrowPage>
      <StartAuth questions={questions} setQuestions={setQuestions} />
    </NarrowPage>
  );
}

import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import routes from "../../../utils/routes";
import MainLayout from "../../../layouts/common";
import Input from "../../../components/form/input";
import { GetStaticPaths, GetStaticProps } from "next";
import pick from "lodash/pick";
import { useTranslations } from "next-intl";
import { PrismaClient } from "@prisma/client";

const AddTimePage = () => {
  const router = useRouter();
  const runId = router.query.id as string;
  const addTime = trpc.running.addTime.useMutation();
  useSession({
    required: true,
    onUnauthenticated: () => {
      router.push(routes.account.signIn);
    },
  });
  const [time, setTime] = useState("");

  const t = useTranslations("RunningAdd");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const timeArr = time.split(":") as [string, string];
    const timeInSeconds = +timeArr[0] * 60 + +timeArr[1];

    if (!time) return;

    addTime.mutate(
      { id: runId, time: timeInSeconds },
      { onSuccess: () => router.push(routes.running.i) }
    );
  };

  return (
    <MainLayout className="flex h-full flex-col justify-center">
      <form
        onSubmit={onSubmit}
        className="mx-auto w-4/6 rounded-md bg-black/20 p-4 dark:bg-white/20 md:w-2/6"
      >
        <Input
          label={t("time")}
          val={time}
          set={setTime}
          type="text"
          pattern="[0-9]*:[0-9][0-9]"
          placeholder="121:09"
        />
        <button
          disabled={addTime.isLoading}
          type="submit"
          className="mt-2 w-full rounded-md bg-white p-2 text-black hover:bg-gray-100 disabled:bg-gray-300"
        >
          {t("submit")}
        </button>
      </form>
    </MainLayout>
  );
};

AddTimePage.messages = ["RunningAdd", ...MainLayout.messages];
export default AddTimePage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    messages: pick(
      await import(`/messages/${locale}.json`),
      AddTimePage.messages
    ),
  },
});

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await new PrismaClient().run.findMany({ select: { id: true } });
  const paths = res.map((item) => ({
    params: { id: item.id },
  }));
  return {
    paths,
    fallback: true,
  };
};
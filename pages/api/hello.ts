// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as Sentry from "@sentry/react";

type Data = {
  name: string;
};

Sentry.init({
  dsn: "https://86f725db0347405faba65639f4d88be4@o1191512.ingest.sentry.io/6312899",
  beforeSend: function (event, hint) {
    const exception = hint.originalException;

    if (exception instanceof Error) {
      event.fingerprint = ["This is a backend response"];
    }

    return event;
  },
});

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const transaction = Sentry.startTransaction({
    op: "test",
    name: "My First Test Transaction",
  });

  setTimeout(() => {
    try {
      new Error("lets crash this");
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      transaction.finish();
    }
  }, 99);

  res.status(200).json({ name: "John Doe" });
}

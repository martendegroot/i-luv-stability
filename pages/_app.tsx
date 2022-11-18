import "../styles/globals.css";
import type { AppProps } from "next/app";
import * as Sentry from "@sentry/react";
import { faker } from "@faker-js/faker";

Sentry.init({
  dsn: "https://86f725db0347405faba65639f4d88be4@o1191512.ingest.sentry.io/6312899",
  beforeSend: function (event, hint) {
    const exception = hint.originalException;

    if (exception instanceof Error) {
      event.fingerprint = ["something bad happened"];
    }

    return event;
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

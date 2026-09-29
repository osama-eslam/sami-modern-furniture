import { notFound } from "next/navigation";

/** Any unknown URL under /ar or /en renders the localized 404. */
export default function CatchAll() {
  notFound();
}

import { redirect } from "next/navigation";

// The Check page was merged into the combined Home page (/board).
// Keep this route as a redirect so existing bookmarks/links don't 404.
export default function CheckRedirect() {
  redirect("/board");
}

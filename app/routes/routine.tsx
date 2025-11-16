import Routine from "~/routine/routine";
import type { Route } from "./+types/home";``
import Landing from "~/landing/landing";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Routine" },
    { name: "description", content: "Quiz routine" },
  ];
}

export default function RoutineRoute() {
  return <Routine />;
}

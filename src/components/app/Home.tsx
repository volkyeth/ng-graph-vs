import { graphIdAtom } from "@/graph/state";
import { useSetAtom } from "jotai";
import { Trash } from "lucide-react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/button";

export const Home = () => {
  const [newSessionId, setNewSessionId] = useState<string>(
    Math.random().toString(36).substring(7)
  );
  const [sessionIds, setSessionIds] = useState<string[]>([]);
  const refreshSessionIds = useCallback(() => {
    const ids: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      key && key !== "helpDialogOpen" && ids.push(localStorage.key(i)!);
    }
    setSessionIds(ids);
  }, []);
  useEffect(() => {
    refreshSessionIds();
  }, [refreshSessionIds]);

  const setGraphId = useSetAtom(graphIdAtom);
  return (
    <div className="w-full h-full flex flex-col gap-10 p-6 ">
      <h1 className="font-bold text-4xl">Proto Negation Game</h1>

      <div className="flex flex-col gap-2 ">
        <h2 className="font-bold text-2xl mb-6">Create a new session:</h2>
        <Label>Session Id:</Label>
        <div className="flex w-fit gap-2">
          <Input
            className="w-56 h-10"
            value={newSessionId}
            onChange={(e) => setNewSessionId(e.target.value)}
          />
          <Button onClick={() => setGraphId(newSessionId)}>New session</Button>
        </div>
      </div>

      <div>
        <h2 className="font-bold text-2xl mb-6">Saved sessions:</h2>
        <div className="grid grid-cols-2 gap-1 ">
          {sessionIds.map((sessionId) => (
            <Fragment key={sessionId}>
              <Button
                variant={"outline"}
                onClick={() => {
                  setGraphId(sessionId!);
                }}
              >
                {sessionId}
              </Button>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  localStorage.removeItem(sessionId!);
                  refreshSessionIds();
                }}
              >
                <Trash />
              </Button>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

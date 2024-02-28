import { graphIdAtom } from "@/graph/state";
import { useSetAtom } from "jotai";
import { RefreshCcw, Trash } from "lucide-react";
import { generateSlug } from "random-word-slugs";
import { Fragment, useCallback, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/button";

export const Home = () => {
  const [newSessionId, setNewSessionId] = useState<string>(generateSlug());
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
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setNewSessionId(generateSlug())}
          >
            <RefreshCcw />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 ">
        <h2 className="font-bold text-2xl mb-6">Load a session:</h2>
        <Dropzone
          accept={{ "application/json": [".ng.json", ".ng"] }}
          onDrop={(acceptedFiles) => {
            const reader = new FileReader();
            for (const file of acceptedFiles) {
              reader.onload = () => {
                const content = reader.result as string;
                const sessionId = getNextAvailableSessionId(
                  file.name.split(".")[0]
                );
                localStorage.setItem(sessionId, content);
                refreshSessionIds();
              };
              reader.readAsText(file);
            }
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div
                {...getRootProps()}
                className="flex items-center justify-center border rounded-md shadow-inner bg-slate-100 w-80 h-32 p-10 cursor-pointer"
              >
                <input {...getInputProps()} />
                <p className="text-center select-none">
                  Drop some .ng.json files here, or click to select files
                </p>
              </div>
            </section>
          )}
        </Dropzone>
      </div>

      <div>
        <h2 className="font-bold text-2xl mb-6">Saved sessions:</h2>
        <div className="grid grid-cols-[max-content_100px_100px_100px_auto] gap-1 ">
          {sessionIds.map((sessionId) => (
            <Fragment key={sessionId}>
              <Input
                className="shadow-inner h-10"
                placeholder="Session ID"
                defaultValue={sessionId}
                onBlur={(e) => {
                  const newSessionId = e.target.value;
                  if (newSessionId === sessionId) return;

                  const updatedSessionId =
                    getNextAvailableSessionId(newSessionId);
                  e.target.value = updatedSessionId;
                  const data = localStorage.getItem(sessionId);
                  localStorage.setItem(updatedSessionId, data!);
                  localStorage.removeItem(sessionId);
                  refreshSessionIds();
                }}
              />
              <Button
                variant={"ghost"}
                onClick={() => {
                  setGraphId(sessionId!);
                }}
              >
                Open
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => {
                  const newSessionId = getNextAvailableSessionId(sessionId!);
                  const data = localStorage.getItem(sessionId!);
                  localStorage.setItem(newSessionId, data!);
                  refreshSessionIds();
                }}
              >
                Duplicate
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => {
                  const data = new Blob(
                    [
                      JSON.stringify(
                        JSON.parse(localStorage.getItem(sessionId!)!),
                        null,
                        2
                      ),
                    ],
                    {
                      type: "application/json",
                    }
                  );
                  const objectUrl = window.URL.createObjectURL(data);

                  const link = document.createElement("a");
                  link.href = objectUrl;
                  link.download = `${sessionId}.ng.json`;
                  link.click();

                  link.remove();
                  window.URL.revokeObjectURL(objectUrl);
                }}
              >
                Export
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

const getNextAvailableSessionId = (sessionId: string) => {
  let counter = 0;
  while (
    localStorage.getItem(`${sessionId}${counter ? `(${counter})` : ""}`) !==
    null
  ) {
    counter++;
  }

  return `${sessionId}${counter ? `(${counter})` : ""}`;
};

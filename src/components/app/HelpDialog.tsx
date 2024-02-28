import { helpDialogOpenAtom } from "@/graph/state";
import { useAtom } from "jotai";
import {
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  ArrowBigUp,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
} from "../ui/Dialog";

export const HelpDialog = () => {
  const [helpDialogOpen, setHelpDialogOpen] = useAtom(helpDialogOpenAtom);
  return (
    <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
      <DialogOverlay />
      <DialogContent className="flex flex-col items-center gap-10 max-w-2xl bg-white">
        <DialogClose className="absolute right-4 top-4">X</DialogClose>
        <h1 className="font-bold text-4xl">Cheat sheet</h1>
        <div className="grid grid-cols-2 items-center gap-4">
          <p className="font-semibold justify-self-end">
            Double click on board
          </p>
          <p className="text-slate-600">Add a point</p>
          <p className="font-semibold justify-self-end">
            Tap a Point or Relevance node
          </p>
          <p className="text-slate-600">Open the context menu</p>
          <p className="font-semibold justify-self-end">
            Right-click/Two-finger tap a Point
          </p>
          <p className="text-slate-600">Edit point</p>
          <p className="font-semibold justify-self-end text-right">
            Right-click/Two-finger drag from a Point to a Point/Relevance node
          </p>
          <p className="text-slate-600">Create a negation with the point</p>
          <ArrowBigLeft className="justify-self-end p-2 h-10 w-10 rounded-sm border-2" />
          <p className="text-slate-600">Reduce amount of algo iterations</p>
          <ArrowBigRight className="justify-self-end p-2 h-10 w-10 rounded-sm border-2" />
          <p className="text-slate-600">Increase amount of algo iterations</p>
          <ArrowBigUp className="justify-self-end p-2 h-10 w-10 rounded-sm border-2" />
          <p className="text-slate-600">Rerun algo with latest changes</p>
          <ArrowBigDown className="justify-self-end p-2 h-10 w-10 rounded-sm border-2" />
          <p className="text-slate-600">
            Set amount of algo iterations to zero
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

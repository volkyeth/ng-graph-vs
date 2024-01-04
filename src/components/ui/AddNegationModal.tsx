import { FC, useState } from "react";
import {
  useDismissNegationModal,
  useIsNegationModalOpen,
  useNegationModalCallback,
} from "./AddNegationModal.state";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "./Dialog";
import { Label } from "./Label";
import { Textarea } from "./Textarea";
import { Button } from "./button";

export interface AddNegationModalProps {}

export const AddNegationModal: FC<AddNegationModalProps> = () => {
  const open = useIsNegationModalOpen();
  const onAddNegation = useNegationModalCallback();
  const [negation, setNegation] = useState("");
  const dismissModal = useDismissNegationModal();
  return (
    <Dialog open={open} onOpenChange={dismissModal}>
      <DialogOverlay />
      <DialogContent className="flex flex-col gap-10 sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Add negation</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-start gap-4">
          <Label htmlFor="negation" className="text-right">
            Negation {negation.length}/320
          </Label>
          <Textarea
            autoFocus
            id="negation"
            value={negation}
            onChange={(e) => setNegation(e.target.value)}
            maxLength={320}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={() => {
              if (!onAddNegation) return;
              console.log("adding negation", negation);

              onAddNegation(negation);
              setNegation("");
              dismissModal();
            }}
          >
            Add negation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

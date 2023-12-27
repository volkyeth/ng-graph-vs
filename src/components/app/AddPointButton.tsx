import { useCyInstance } from "@/hooks/useCyInstance";
import { FC } from "react";
import { ulid } from "ulid";
import { Button, ButtonProps } from "../ui/button";

export interface AddPointButtonProps extends ButtonProps {}

export const AddPointButton: FC<AddPointButtonProps> = ({ ...props }) => {
  const cyInstance = useCyInstance();
  return (
    <Button
      onClick={() => {
        if (!cyInstance) return;

        cyInstance.add({
          data: {
            id: ulid(),
            text: "test",
          },
          classes: "point",
        });
      }}
      {...props}
    >
      +
    </Button>
  );
};

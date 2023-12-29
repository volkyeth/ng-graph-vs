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

        cyInstance.one("add", (e) => {
          cyInstance
            .elements()
            .layout({
              name: "cose",
              animate: true,
              boundingBox: cyInstance.elements().boundingBox(),
              //   initialTemp: 200,
              animationThreshold: 250,
              fit: false,
              animationDuration: 2000,
              numIter: 10000,
            })
            .run();
        });

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

import type React from "react";
import { Sheet } from "react-modal-sheet";

interface RaBottomSheetProps {
  children: React.ReactNode;
  snapPoints?: number[];
  initialSnap?: number;
  contentClassName?: string;
}

function RaBottomSheet({
  children,
  snapPoints = [0.6, 80],
  initialSnap = 2,
  contentClassName = "px-4 pb-6",
}: RaBottomSheetProps) {
  return (
    <Sheet
      disableScrollLocking
      isOpen={true}
      onClose={() => { }}
      disableDismiss
      snapPoints={snapPoints}
      initialSnap={initialSnap}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className={contentClassName}>
            {children}
          </div>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}

export default RaBottomSheet;

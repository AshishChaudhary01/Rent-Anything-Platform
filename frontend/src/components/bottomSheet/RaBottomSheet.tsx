import type React from "react";
import { Sheet } from "react-modal-sheet";

interface RaBottomSheetProps {
  children: React.ReactNode;
  snapPoints?: number[];
  initialSnap?: number;
}

function RaBottomSheet({
  children,
  snapPoints = [0.65, 220],
  initialSnap = 1,
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
          <div className="px-4 pb-6">
            {children}
          </div>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}

export default RaBottomSheet;

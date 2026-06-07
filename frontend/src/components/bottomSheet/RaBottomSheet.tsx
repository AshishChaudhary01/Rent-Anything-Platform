import type React from "react";
import { Sheet } from "react-modal-sheet";

interface RaBottomSheetProps {
  children: React.ReactNode;
}

function RaBottomSheet({
  children
}: RaBottomSheetProps) {
  return (
    <Sheet
      disableScrollLocking
      isOpen={true}
      onClose={() => { }}
      disableDismiss
      snapPoints={[0.6, 80]}
      initialSnap={2}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          {children}
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}

export default RaBottomSheet;
'use client';

import * as React from 'react';
import { ResponsiveModal } from './responsive-modal';
import { Button } from './button';

export function ResponsiveModalDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-4 p-8">
      <h2 className="font-display text-2xl font-bold text-[#3D4852]">Responsive Modal Demo</h2>
      <p className="text-[#6B7280]">
        This modal becomes a bottom drawer on mobile (below 768px) and a centered dialog on desktop.
      </p>

      <Button onClick={() => setOpen(true)}>Open Responsive Modal</Button>

      <ResponsiveModal
        open={open}
        onOpenChange={setOpen}
        title="Responsive Modal Example"
        description="This is a description that explains what this modal is about."
        size="default"
        showCloseButton={true}
        footer={
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)} className="flex-1 sm:flex-none">
              Confirm
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-[#3D4852]">
            This is the content of the responsive modal. On mobile devices (screens narrower than
            768px), this will appear as a bottom drawer that slides up from the bottom of the
            screen.
          </p>
          <p className="text-[#6B7280]">
            On desktop devices, it appears as a centered modal dialog with a backdrop. Both
            variations use smooth animations and neumorphic styling.
          </p>
          <div className="space-y-2">
            <h3 className="font-semibold text-[#3D4852]">Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-[#6B7280]">
              <li>Automatically switches between dialog and drawer based on screen size</li>
              <li>Smooth spring-like animations</li>
              <li>Swipe-to-close on mobile</li>
              <li>Neumorphic design system</li>
              <li>Configurable sizes and options</li>
            </ul>
          </div>
        </div>
      </ResponsiveModal>
    </div>
  );
}

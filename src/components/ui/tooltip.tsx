import * as React from "react";

// Dynamically import the Radix-based implementation to keep it out of the
// initial bundle and avoid loading on coarse pointers (touch devices).
const TooltipProviderImpl = React.lazy(() =>
  import("./tooltip-impl").then((m) => ({ default: m.TooltipProvider }))
);
const TooltipImpl = React.lazy(() =>
  import("./tooltip-impl").then((m) => ({ default: m.Tooltip }))
);
const TooltipTriggerImpl = React.lazy(() =>
  import("./tooltip-impl").then((m) => ({ default: m.TooltipTrigger }))
);
const TooltipContentImpl = React.lazy(() =>
  import("./tooltip-impl").then((m) => ({ default: m.TooltipContent }))
);

const isFinePointer =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(pointer: fine)").matches;

function TooltipProvider(
  props: React.ComponentProps<any> & { children?: React.ReactNode }
) {
  if (!isFinePointer) return <>{props.children}</>;
  return (
    <React.Suspense fallback={<>{props.children}</>}>
      <TooltipProviderImpl {...props} />
    </React.Suspense>
  );
}

function Tooltip(props: React.ComponentProps<any>) {
  if (!isFinePointer) return <>{props?.children}</>;
  return (
    <React.Suspense fallback={<>{props?.children}</>}>
      <TooltipImpl {...props} />
    </React.Suspense>
  );
}

function TooltipTrigger(props: React.ComponentProps<any>) {
  if (!isFinePointer) return <>{props?.children}</>;
  return (
    <React.Suspense fallback={<>{props?.children}</>}>
      <TooltipTriggerImpl {...props} />
    </React.Suspense>
  );
}

function TooltipContent(props: React.ComponentProps<any>) {
  if (!isFinePointer) return null;
  return (
    <React.Suspense fallback={null}>
      <TooltipContentImpl {...props} />
    </React.Suspense>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

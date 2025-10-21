import * as React from "react";

const DropdownMenuImpl = React.lazy(() => import("./dropdown-menu-impl").then(m => ({ default: m.DropdownMenu })));
const DropdownMenuPortalImpl = React.lazy(() => import("./dropdown-menu-impl").then(m => ({ default: m.DropdownMenuPortal })));
const DropdownMenuTriggerImpl = React.lazy(() => import("./dropdown-menu-impl").then(m => ({ default: m.DropdownMenuTrigger })));
const DropdownMenuContentImpl = React.lazy(() => import("./dropdown-menu-impl").then(m => ({ default: m.DropdownMenuContent })));
const DropdownMenuGroupImpl = React.lazy(() => import("./dropdown-menu-impl").then(m => ({ default: m.DropdownMenuGroup })));
const DropdownMenuLabelImpl = React.lazy(() => import("./dropdown-menu-impl").then(m => ({ default: m.DropdownMenuLabel })));
const DropdownMenuItemImpl = React.lazy(() => import("./dropdown-menu-impl").then(m => ({ default: m.DropdownMenuItem })));
const DropdownMenuCheckboxItemImpl = React.lazy(() => import("./dropdown-menu-impl").then(m => ({ default: m.DropdownMenuCheckboxItem })));
const DropdownMenuRadioGroupImpl = React.lazy(() => import("./dropdown-menu-impl").then(m => ({ default: m.DropdownMenuRadioGroup })));
const DropdownMenuRadioItemImpl = React.lazy(() => import("./dropdown-menu-impl").then(m => ({ default: m.DropdownMenuRadioItem })));
const DropdownMenuSeparatorImpl = React.lazy(() => import("./dropdown-menu-impl").then(m => ({ default: m.DropdownMenuSeparator })));
const DropdownMenuShortcutImpl = React.lazy(() => import("./dropdown-menu-impl").then(m => ({ default: m.DropdownMenuShortcut })));
const DropdownMenuSubImpl = React.lazy(() => import("./dropdown-menu-impl").then(m => ({ default: m.DropdownMenuSub })));
const DropdownMenuSubTriggerImpl = React.lazy(() => import("./dropdown-menu-impl").then(m => ({ default: m.DropdownMenuSubTrigger })));
const DropdownMenuSubContentImpl = React.lazy(() => import("./dropdown-menu-impl").then(m => ({ default: m.DropdownMenuSubContent })));

function withSuspense(Comp: React.LazyExoticComponent<React.ComponentType<any>>, useChildrenFallback = false) {
  return function Wrapper(props: any) {
    const fallback = useChildrenFallback ? props?.children ?? null : null;
    return (
      <React.Suspense fallback={fallback}>
        <Comp {...props} />
      </React.Suspense>
    );
  };
}

const DropdownMenu = withSuspense(DropdownMenuImpl);
const DropdownMenuPortal = withSuspense(DropdownMenuPortalImpl);
const DropdownMenuTrigger = withSuspense(DropdownMenuTriggerImpl, true);
const DropdownMenuContent = withSuspense(DropdownMenuContentImpl);
const DropdownMenuGroup = withSuspense(DropdownMenuGroupImpl);
const DropdownMenuLabel = withSuspense(DropdownMenuLabelImpl);
const DropdownMenuItem = withSuspense(DropdownMenuItemImpl);
const DropdownMenuCheckboxItem = withSuspense(DropdownMenuCheckboxItemImpl);
const DropdownMenuRadioGroup = withSuspense(DropdownMenuRadioGroupImpl);
const DropdownMenuRadioItem = withSuspense(DropdownMenuRadioItemImpl);
const DropdownMenuSeparator = withSuspense(DropdownMenuSeparatorImpl);
const DropdownMenuShortcut = withSuspense(DropdownMenuShortcutImpl);
const DropdownMenuSub = withSuspense(DropdownMenuSubImpl);
const DropdownMenuSubTrigger = withSuspense(DropdownMenuSubTriggerImpl, true);
const DropdownMenuSubContent = withSuspense(DropdownMenuSubContentImpl);

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}

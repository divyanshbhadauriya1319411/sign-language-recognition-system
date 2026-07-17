/**
 * Master Reusable Component Library Barrel File
 * AI-powered Sign Language Recognition & Translation Platform (SignBridge AI)
 */

// 1. Core UI Foundations (`src/components/ui`)
// Exclude duplicate names so our explicit exports take precedence and avoid TS2308 ambiguity
export { Input, Select, Card, Badge, Modal } from './ui';
export type { InputProps, SelectProps, CardProps, BadgeProps, ModalProps } from './ui';

// 2. Buttons & Actions Module (`src/components/buttons`)
export * from './buttons';

// 3. Form Components Module (`src/components/forms`)
export * from './forms';

// 4. Specialized AI Module (`src/components/ai`)
export * from './ai';

// 5. Navigation Module (`src/components/navigation`)
export * from './navigation';

// 6. Cards & Containers Module (`src/components/cards`)
export * from './cards';

// 7. Data Display Module (`src/components/data-display`)
export * from './data-display';

// 8. Feedback & Alerts Module (`src/components/feedback`)
export * from './feedback';

// 9. Progress & Loading Module (`src/components/progress`)
export * from './progress';

// 10. Utility & Overlay Module (`src/components/utility`)
// Exclude Modal and Badge to avoid conflicts with ./ui
export { Avatar, Tooltip, Popover, Accordion, Tabs, DropdownMenu } from './utility';
export type { AvatarProps, TooltipProps, PopoverProps, AccordionProps, TabsProps, DropdownMenuProps } from './utility';

// 11. Empty States Module (`src/components/empty-states`)
export * from './empty-states';

// 12. Error States Module (`src/components/error-states`)
export * from './error-states';

// 13. Legacy Studio component re-exports
export * from './studio/CameraStudio';
export * from './studio/MediaPipeCanvas';
export * from './studio/TranslationTranscript';
export * from './studio/VocabularyDrawer';

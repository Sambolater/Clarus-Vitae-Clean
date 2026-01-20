/**
 * Clarus Vitae - UI Component Library
 *
 * A comprehensive UI component library following the Clarus Vitae design system.
 * Built for trust, sophistication, and privacy-conscious wellness intelligence.
 *
 * @packageDocumentation
 */

// ============================================================================
// Button Components
// ============================================================================
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './components/Button';

// ============================================================================
// Layout Components
// ============================================================================
export { Container, type ContainerProps } from './components/Layout';
export { Heading, type HeadingProps } from './components/Layout';

// ============================================================================
// Badge Components
// ============================================================================
export { TierBadge, type TierBadgeProps, type PropertyTier } from './components/Badge';
export { EvidenceLevel, type EvidenceLevelProps, type EvidenceLevelType } from './components/Badge';

// ============================================================================
// Score Components (Clarus Index)
// ============================================================================
export {
  ClarusIndexBadge,
  type ClarusIndexBadgeProps,
  type BadgeSize,
  type IndexTier,
} from './components/Score';
export {
  ScoreBreakdown,
  type ScoreBreakdownProps,
  type DimensionScore,
  type IndexDimension,
} from './components/Score';
export {
  ScoreComparison,
  type ScoreComparisonProps,
  type ComparisonProperty,
} from './components/Score';

// ============================================================================
// Card Components
// ============================================================================
export { PropertyCard, type PropertyCardProps } from './components/Card';
export { TreatmentCard, type TreatmentCardProps } from './components/Card';
export { ReviewCard, type ReviewCardProps } from './components/Card';
export { TeamMemberCard, type TeamMemberCardProps } from './components/Card';
export { StatCard, type StatCardProps } from './components/Card';

// ============================================================================
// Form Components
// ============================================================================
export { Input, type InputProps } from './components/Form';
export { Textarea, type TextareaProps } from './components/Form';
export { Select, type SelectProps, type SelectOption } from './components/Form';
export { Checkbox, type CheckboxProps } from './components/Form';
export { RadioGroup, type RadioGroupProps, type RadioOption } from './components/Form';
export { RangeSlider, type RangeSliderProps } from './components/Form';

// ============================================================================
// Navigation Components
// ============================================================================
export { Header, type HeaderProps, type NavLink } from './components/Navigation';
export { Breadcrumbs, type BreadcrumbsProps, type BreadcrumbItem } from './components/Navigation';
export { TabNav, type TabNavProps, type TabItem } from './components/Navigation';
export { FilterSidebar, type FilterSidebarProps, type FilterSection } from './components/Navigation';

// ============================================================================
// Feedback Components
// ============================================================================
export { Alert, type AlertProps, type AlertVariant } from './components/Feedback';
export { Toast, type ToastProps, type ToastVariant } from './components/Feedback';
export { LoadingSpinner, type LoadingSpinnerProps } from './components/Feedback';
export { Skeleton, type SkeletonProps, SkeletonCard, SkeletonText } from './components/Feedback';
export { EmptyState, type EmptyStateProps } from './components/Feedback';
export { ErrorState, type ErrorStateProps } from './components/Feedback';

// ============================================================================
// Overlay Components
// ============================================================================
export { Modal, type ModalProps } from './components/Overlay';
export { Drawer, type DrawerProps } from './components/Overlay';
export { Tooltip, type TooltipProps } from './components/Overlay';
export { Popover, type PopoverProps } from './components/Overlay';

// ============================================================================
// Privacy Components
// ============================================================================
export { ResearchModeBanner, type ResearchModeBannerProps } from './components/Privacy';
export { PrivacyBadge, type PrivacyBadgeProps, type PrivacyLevel } from './components/Privacy';
export { SecureInquiryBadge, type SecureInquiryBadgeProps } from './components/Privacy';
export { DataDeletionButton, type DataDeletionButtonProps } from './components/Privacy';

// ============================================================================
// Review Components
// ============================================================================
export { StarRating, type StarRatingProps } from './components/Review';
export { RatingBar, type RatingBarProps } from './components/Review';
export { OutcomeIndicator, type OutcomeIndicatorProps, type OutcomeLevel } from './components/Review';
export { VerifiedBadge, type VerifiedBadgeProps, type VerificationType } from './components/Review';

// ============================================================================
// Data Display Components
// ============================================================================
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  type TableProps,
  type TableHeaderProps,
  type TableBodyProps,
  type TableRowProps,
  type TableHeadProps,
  type TableCellProps,
} from './components/DataDisplay';
export { StatGrid, type StatGridProps, type StatItem } from './components/DataDisplay';
export { PriceRange, type PriceRangeProps } from './components/DataDisplay';
export {
  ComparisonTable,
  type ComparisonTableProps,
  type ComparisonItem,
  type ComparisonRow,
} from './components/DataDisplay';

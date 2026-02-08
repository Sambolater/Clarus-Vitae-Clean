import { SiteHeader } from '@/components/SiteHeader';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      {children}
      {/* Footer will be added in UI component library task */}
    </>
  );
}

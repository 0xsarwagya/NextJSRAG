import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="container pt-8 pb-8 px-4 sm:px-8">
        <div className="text-2xl font-bold mb-4">{title}</div>
        <div className="border border-muted-foreground rounded-none p-2 lg:p-5 border-dashed">
        {children}
        </div>
      </div>
    </div>
  );
}

// This is a proper layout component for the login page
export default function StaffLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto py-8">{children}</div>
    </div>
  );
}

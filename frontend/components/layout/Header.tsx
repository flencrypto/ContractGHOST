interface HeaderProps {
  title: string;
  action?: React.ReactNode;
}

export default function Header({ title, action }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900">
      <h1 className="text-xl font-semibold text-white">{title}</h1>
      {action && <div>{action}</div>}
    </header>
  );
}

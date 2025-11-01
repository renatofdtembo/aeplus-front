import { useAuth } from "../services/AuthService";

export default function SidebarWidget() {
  const { currentfuncao, user } = useAuth();

  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03] overflow-hidden`}
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
        {user?.name}
      </h3>
      <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        {currentfuncao?.nome}
      </p>
    </div>
  );
}

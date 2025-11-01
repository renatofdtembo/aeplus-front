import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import { DefaultIcon } from "../hooks/DefaultIcon";
import { useAuth } from "../services/AuthService";
import { ChevronDownIcon } from "lucide-react";

export type MenuItem = {
  name: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  badge?: string;
};

const AppSidebar: React.FC = () => {
  const { isAuthenticated, user, currentMenus } = useAuth();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [menuitems, setMenus] = useState<MenuItem[]>([]);
  const [activePath, setActivePath] = useState<string | null>(null);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function Inicializar() {
      if (!isAuthenticated) return;

      await setMenus(currentMenus);
      setLoading(false);
    }

    Inicializar();
  }, [user, isAuthenticated, currentMenus]);

  // Detecta o item mais específico da rota ativa
  useEffect(() => {
    const findActivePath = (items: MenuItem[]): string | null => {
      let match: string | null = null;

      const check = (menus: MenuItem[]) => {
        for (const item of menus) {
          if (item.path && location.pathname === item.path) {
            match = item.path;
          } else if (item.path && location.pathname.startsWith(item.path) && !match) {
            match = item.path;
          }
          if (item.children) {
            check(item.children);
          }
        }
      };

      check(items);
      return match;
    };

    const foundPath = findActivePath(menuitems);
    setActivePath(foundPath || null);
  }, [location.pathname, menuitems]);

  const toggleMenu = (path: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };
  const renderMenuItems = (items: MenuItem[], level = 0) => (
    <ul className={`space-y-1 ${level > 0 ? 'mt-1' : ''}`} style={{ padding: 0, margin: 0 }}>
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openMenus[item.path || ''] || false;
        const active = item.path === activePath;

        return (
          <li key={`${item.path}-${level}`}>
            <div className="relative">
              {hasChildren ? (
                <button
                  onClick={() => toggleMenu(item.path || '')}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors
                    ${active ? 'bg-blue-50 text-blue-600 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
                    ${level === 0 ? 'font-medium' : 'font-normal'}
                    ${level > 0 ? `pl-${4 + level * 2}` : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`${active ? 'text-blue-600' : 'text-gray-600 dark:text-white'}`}>
                      <DefaultIcon name={item.icon} size={20} />
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="whitespace-nowrap overflow-hidden overflow-ellipsis dark:text-white">
                        {item.name}
                      </span>
                    )}
                  </div>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDownIcon className="w-4 h-4 dark:text-white" />
                    </span>
                  )}
                </button>
              ) : (
                <Link
                  to={item.path || '#'}
                  className={`w-full flex items-center p-2 rounded-lg transition-colors
                    ${active ? 'bg-blue-50 text-blue-600 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
                    ${level === 0 ? 'font-medium' : 'font-normal'}
                    ${level > 0 ? `pl-${4 + level * 2}` : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`pl-1 ${active ? 'text-blue-600' : 'text-gray-600 dark:text-white'}`}>
                      <DefaultIcon name={item.icon} size={17} />
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="whitespace-nowrap overflow-hidden overflow-ellipsis dark:text-white">
                        {item.name}
                      </span>
                    )}
                  </div>
                  {item.badge && (isExpanded || isHovered || isMobileOpen) && (
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full 
                      ${active
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>

            {hasChildren && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => { menuRefs.current[item.path || ''] = el; }}
                className={`overflow-hidden transition-all duration-300
                  ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
              >
                {renderMenuItems(item.children || [], level + 1)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-4 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-white h-screen transition-all duration-300 ease-in-out z-100 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-68" : isHovered ? "w-68" : "w-24"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1 overflow-y-auto py-4">
        <div className="mb-3 px-1 flex items-center justify-center">
          <Link to="/">
            {(isExpanded || isHovered || isMobileOpen) ? (
              <img src={`${import.meta.env.VITE_API_URL}/uploads/default.png`} alt="Logo" className="h-35 rounded-full" />
            ) : (
              <img src={`${import.meta.env.VITE_API_URL}/uploads/default.png`} alt="Logo" className="h-18 rounded-full" />
            )}
          </Link>
        </div>
        <hr className="pb-3" />
        <nav>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : renderMenuItems(menuitems)}
        </nav>
      </div>

      {/* Bottom section: fixed SidebarWidget */}
      {/* Renderiza SidebarWidget apenas se houver múltiplos perfis */}
      {<SidebarWidget />}
    </aside>
  );
};

export default AppSidebar;

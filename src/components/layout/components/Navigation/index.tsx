import clientAPI from "~/client-api/rest-client";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type ApiResponse from "~/model/ApiResponse";
import type CategoriesResponse from "~/model/CategoriesResponse";
import type BrandsResponse from "~/model/BrandsResponse";
import type { SaleProgram as SaleProgramModel } from "~/model/ProductDetail";
import {
  FaBars,
  FaChevronDown,
  FaFacebook,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";

/* Types */

interface NavChildNode {
  id: string;
  name: string;
  slug: string;
}

interface NavMenuNode extends NavChildNode {
  children?: NavChildNode[] | null;
}

interface SaleProgram extends SaleProgramModel {
  children?: NavChildNode[] | null;
}

interface MenuItem {
  label: string;
  href: string;
  data: NavMenuNode[];
}
/* Constants */

const CATEGORIES_URL = "client/categories";
const BRANDS_URL = "brands";
const SALE_PROGRAMS_URL = "saleprogram/homepage";
const FACEBOOK_URL = "https://www.facebook.com/tran.tuananh.676457/";

interface NavDropdownProps {
  items: NavMenuNode[];
  href: string;
  onClose: () => void;
}

function NavDropdown({ items, href, onClose }: NavDropdownProps) {
  return (
    <ul className="grid min-w-56 gap-1 p-2 sm:min-w-64">
      {items.map((item) => {
        const hasChildren = Boolean(item.children?.length);

        return (
          <li key={item.id || item.slug}>
            <Link
              to={`${href}/${item.slug}`}
              onClick={onClose}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-lime-50 hover:text-lime-800"
            >
              <span>{item.name}</span>
              {hasChildren && <span aria-hidden="true">›</span>}
            </Link>
            {hasChildren && (
              <ul className="ml-3 border-l border-lime-100 pl-2">
                {item.children?.map((child) => (
                  <li key={child.id || child.slug}>
                    <Link
                      to={`${href}/${child.slug}`}
                      onClick={onClose}
                      className="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-lime-50 hover:text-lime-800"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* Navigation */

function Navigation() {
  const [dataCategories, setDataCategories] = useState<CategoriesResponse[]>(
    [],
  );
  const [dataBrands, setDataBrands] = useState<BrandsResponse[]>([]);
  const [salePrograms, setSalePrograms] = useState<SaleProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigationRef = useRef<HTMLElement | null>(null);

  const loadMenuData = useCallback(async () => {
    try {
      const [categoriesApi, brandsApi, saleProgramsApi]: ApiResponse[] =
        await Promise.all([
          clientAPI.service(CATEGORIES_URL).find(),
          clientAPI.service(BRANDS_URL).find(),
          clientAPI.service(SALE_PROGRAMS_URL).find(),
        ]);

      setDataCategories((categoriesApi?.result ?? []) as CategoriesResponse[]);
      setDataBrands((brandsApi?.result ?? []) as BrandsResponse[]);
      setSalePrograms((saleProgramsApi?.result ?? []) as SaleProgram[]);
    } catch (error) {
      console.error("Failed to load navigation data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenuData();
  }, [loadMenuData]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!navigationRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
        setIsMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const menuItems: MenuItem[] = [
    {
      label: "Danh mục",
      href: "/categories",
      data: dataCategories,
    },
    {
      label: "Thương hiệu",
      href: "/brands",
      data: dataBrands,
    },
    {
      label: "Khuyến mãi %",
      href: "/products",
      data: salePrograms,
    },
  ];

  const closeNavigation = () => {
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      ref={navigationRef}
      aria-label="Điều hướng chính"
      className="w-full font-bold"
    >
      <div className="flex justify-end md:hidden">
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="main-navigation-menu"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          className="rounded-md p-2 text-[#d7f0db] transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-lime-300"
        >
          {isMobileMenuOpen ? (
            <FaTimes aria-hidden="true" className="size-5" />
          ) : (
            <FaBars aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>

      <ul
        id="main-navigation-menu"
        className={`${isMobileMenuOpen ? "flex" : "hidden"} mt-2 flex-col gap-1 border-t border-white/10 pt-2 md:flex md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-x-6 md:gap-y-1 md:border-0 md:pt-0`}
      >
        {menuItems.map((item) => (
          <li key={item.href} className="relative w-full md:w-auto">
            <button
              type="button"
              aria-expanded={openMenu === item.href}
              aria-haspopup="true"
              onClick={() =>
                setOpenMenu((current) =>
                  current === item.href ? null : item.href,
                )
              }
              className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm text-[#d7f0db] transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-lime-300 md:w-auto md:justify-center md:text-center"
            >
              {item.label}
              <FaChevronDown
                aria-hidden="true"
                className={`size-3 transition-transform ${openMenu === item.href ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`z-50 rounded-lg bg-white font-bold shadow-xl ring-1 ring-black/5 transition-all duration-150 md:absolute md:left-1/2 md:top-full md:mt-2 md:-translate-x-1/2 ${
                openMenu === item.href
                  ? "visible mt-1 max-h-[70vh] translate-y-0 overflow-y-auto opacity-100 md:mt-2 md:max-h-none md:overflow-visible "
                  : "invisible hidden max-h-0 -translate-y-1 overflow-hidden opacity-0 md:block"
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2 whitespace-nowrap p-4 text-sm text-gray-500">
                  <FaSpinner className="size-4 animate-spin" /> Đang tải...
                </div>
              ) : (
                <NavDropdown
                  href={item.href}
                  items={item.data}
                  onClose={closeNavigation}
                />
              )}
            </div>
          </li>
        ))}

        <li>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-[#d7f0db] transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-lime-300"
            onClick={closeNavigation}
          >
            <FaFacebook aria-hidden="true" />
            About Us
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default memo(Navigation);

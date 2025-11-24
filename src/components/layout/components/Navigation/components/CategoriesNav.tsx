import { Link } from "react-router-dom";

interface ItemCategory {
  id: string;
  name: string;
  slug: string;
  children: any[] | null;
  isShow: boolean;
}

interface Props {
  items: ItemCategory[];
  setState: any;
}

const NavItem: React.FC<Props> = ({ items, setState }) => {

  const triggerShow = (idCategory: string, isShow: boolean) => {
    const updatedCategories = items.map((category) => {
      // Cập nhật isShow cho tất cả các category
      return {
        ...category,
        isShow: category.id === idCategory ? isShow : false,
      };
    });

    setState(updatedCategories); // Cập nhật state
  };


  return (
    <ul className="p-2 space-y-3 w-max">
      {
        items.map((item: ItemCategory, index: number) => (
          <li key={index} className="relative">
            <Link
              to={`/collections/${item.slug || "#"}`}
              className="text-gray-700 hover:text-green-700 text-sm flex items-center font-bold"
              onMouseEnter={() => (triggerShow(item.id || "", true))}
              onMouseLeave={() => (triggerShow(item.id || "", false))}
            >
              {item.name}
            </Link>
            {
              //Children
              item.children && item.children.length > 0 && (
                <div className={`absolute left-full top-0 ml min-w-[10rem] w-max bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 ${item.isShow ? 'visible opacity-100' : 'invisible'} transition-all duration-300 z-50`}
                  onMouseEnter={() => (triggerShow(item.id || "", true))}>
                  <ul className="p-2 space-y-3">
                    {item.children.map((child: any) => (
                      <li key={child.id || child.name}>
                        <Link
                          to={`/collections/${child.slug || "#"}`}
                          className="text-gray-700 hover:text-green-700  text-sm"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </li>
        ))}
    </ul>
  );
};

export default NavItem;

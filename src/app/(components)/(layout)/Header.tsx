interface HeaderProps {
  category?: string;
  title: string;
  description: string;
}

const Header = ({ category, title, description }: HeaderProps) => {
  return (
    <div className="hidden md:block h-[90px] bg-gray-100 border-b border-gray-300 p-5">
      {category && <h2 className="uppercase text-sm mb-5">{category}</h2>}
      <h1 className="mb-1 text-3xl font-semibold">{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default Header;

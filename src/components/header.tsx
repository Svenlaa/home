import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import {
  faBars,
  faHouse,
  faRunning,
  faUser,
  faX,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";

type pathType = {
  href: string;
  label: keyof IntlMessages["Header"];
  icon?: IconDefinition;
};

const paths: Readonly<pathType[]> = [
  { href: "/", label: "home", icon: faHouse },
  { href: "/running", label: "running", icon: faRunning },
  { href: "/account", label: "account", icon: faUser },
] as const;

const Header = () => {
  const t = useTranslations("Header");

  const currPath = useRouter().asPath;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="mx-auto w-screen md:container">
      <div className="mx-auto flex w-full flex-row justify-between bg-white p-4 dark:bg-black md:bg-inherit">
        <Link href="/">
          <a className="my-auto text-3xl duration-200 ease-in hover:text-prime-900 dark:hover:text-prime-200">
            Svenlaa
          </a>
        </Link>

        {/* Section with hamburger for smaller screens */}
        <button
          className="translate block aspect-square rounded-full bg-prime-500 text-3xl text-white md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FontAwesomeIcon
            icon={isOpen ? faX : faBars}
            className="aspect-square scale-90 p-2"
          />
        </button>

        {/* Section that shows tabs on larger screens */}
        <div className="hidden gap-4 md:flex md:flex-row">
          {paths.map((path) => (
            <HeaderLink
              to={path.href}
              isActive={path.href === currPath}
              key={path.href}
              icon={path.icon ? path.icon : undefined}
            >
              {t(path.label)}
            </HeaderLink>
          ))}
        </div>
      </div>

      {/* Dropdown for smaller screens */}
      <div
        className={`${
          isOpen ? "flex flex-col" : "hidden"
        } absolute w-full rounded-b-xl bg-white px-4 drop-shadow-xl dark:bg-gray-900 md:hidden`}
      >
        {paths.map((path) => (
          <HeaderLink
            to={path.href}
            isActive={path.href === currPath}
            key={path.href}
            icon={path.icon ? path.icon : undefined}
          >
            {t(path.label)}
          </HeaderLink>
        ))}
      </div>
    </header>
  );
};

Header.messages = ["Header"];

type LinkProps = {
  to: string;
  children: ReactNode;
  isActive?: boolean;
  icon?: IconDefinition;
};
const HeaderLink = (props: LinkProps) => {
  const { to, children } = props;
  return (
    <Link href={to}>
      <a
        className={`${
          props.isActive
            ? "text-prime-500 md:bg-prime-500 md:text-white md:hover:bg-prime-600"
            : "transition-text delay-75 duration-500 ease-out hover:text-prime-500 md:bg-white md:text-gray-800 md:hover:bg-prime-500 md:hover:text-white md:dark:bg-gray-800 md:dark:text-gray-400"
        }  whitespace-nowrap rounded-md p-2 px-3 text-lg`}
      >
        {props.icon ? (
          <FontAwesomeIcon className="pr-2" icon={props.icon} />
        ) : null}
        {children}
      </a>
    </Link>
  );
};

export default Header;
import {
  Bookmark,
  LucideIcon,
  Bot,
  List,
  Trash,
  BookA,
  GitPullRequest,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Chat",
          icon: Bot,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Knowledge Base",
      menus: [
        {
          href: "/knowledge-base/list",
          label: "Details",
          icon: Bookmark,
        },
        {
          href: "/knowledge-base/add",
          label: "Add",
          icon: List,
        },
        {
          href: "/knowledge-base/remove",
          label: "Remove",
          icon: Trash,
        },
      ],
    },
    {
      groupLabel: "Content",
      menus: [
        {
          href: "/about",
          label: "About",
          icon: BookA,
        },
        {
          href: "/contributing",
          label: "Contribution Guide",
          icon: GitPullRequest,
        },
      ],
    },
  ];
}
